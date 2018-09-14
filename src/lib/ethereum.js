import Web3 from 'web3'
import Web3ProviderEngine from 'web3-provider-engine'
import Web3Subprovider from 'web3-provider-engine/subproviders/web3'
import store from 'redux/store'
import Promise, { each, filter, reduce, promisifyAll } from 'bluebird'
import { uniq } from 'lodash'

import { url } from 'lib/feathers/local/feathersClient'
import { getAbi, getBin } from 'lib/abi'

let web3Url
let web3Port
if (url.split(':')[2]) {
  web3Url = 'http:' + url.split(':')[1]
  web3Port = url.split(':')[2].replace(/\/$/, '') + '/web3'
} else {
  web3Url = url.replace(/\/$/, '')
  if (window.REACT_APP_APP_TYPE) {
    web3Url = web3Url.replace(/\/local-api$/, '')
  }
  web3Port = (/^https/.test(url) ? '443' : '80') + (window.REACT_APP_APP_TYPE ? '/local-api' : '') + '/web3'
}

let web3
let currentAccount

const delay = time => new Promise(resolve => setTimeout(resolve, time))

let attempts = 0
const waitForWeb3 = async () => {
  if (!web3) {
    attempts++
    await delay(500)

    if (attempts < 50) {
      return waitForWeb3()
    } else {
      const error = 'Could not connect to wallet after 50 attempts'
      console.log(error)
      throw new Error(error)
    }
  }
}

const pollForCurrentAccountUpdates = async () => {
  try {
    await waitForWeb3()

    const [account] = await web3.eth.getAccountsAsync()
    if (currentAccount !== account) {
      currentAccount = account
      store.dispatch({ type: 'WALLET_UPDATE_CURRENT_ACCOUNT', address: account })
    }
  } catch (e) {
    console.log(`Error polling for current account updates: ${e.message || e}`)
  }

  await delay(500)

  return pollForCurrentAccountUpdates()
}

const getTokenFromAddress = tokenAddress =>
  store.getState().localToken.queryResult.data.filter(({ address }) => tokenAddress === address)[0]

const getWhitelistFromAddress = contractAddress =>
  store.getState().whitelist.queryResult.data.filter(({ address }) => contractAddress === address)[0]

const getStorageSettingsForToken = async tokenAddress => {
  await waitForWeb3()

  const token = getTokenFromAddress(tokenAddress) || { abiVersion: '07-26-18' } // TODO: find a permanent solution for this

  const deployedTokenContract = web3.eth.contract(getAbi('token', token.abiVersion)).at(tokenAddress)
  promisifyAll(deployedTokenContract.service)

  const regulatorServiceAddress = await deployedTokenContract.service.callAsync()
  const deployedRegulatorServiceContract = web3.eth.contract(getAbi('regulatorService', token.abiVersion)).at(regulatorServiceAddress)
  promisifyAll(deployedRegulatorServiceContract.settingsStorage)

  const storageAddress = await deployedRegulatorServiceContract.settingsStorage.callAsync()
  const contract = web3.eth.contract(getAbi('settingsStorage', token.abiVersion)).at(storageAddress)
  promisifyAll(contract.locked)
  promisifyAll(contract.setInititalOfferEndDate)
  promisifyAll(contract.setLocked)

  return contract
}

const waitBlock = async deployedContract => {
  while (true) {
    const receipt = await web3.eth.getTransactionReceiptAsync(deployedContract.transactionHash)
    if (receipt && receipt.contractAddress) {
      return receipt.contractAddress
    }

    await delay(3000)

    return waitBlock(deployedContract)
  }
}

const deployContract = async (type, ...contractParams) => {
  await waitForWeb3()

  const abi = getAbi(type)
  const data = getBin(type)
  const web3Contract = web3.eth.contract(abi)

  const deployedContract = await new Promise((resolve, reject) => {
    web3Contract.new.apply(web3Contract, contractParams.concat([{ from: currentAccount, data }, (err, res) => {
      if (err) { reject(err) }

      resolve(res)
    }]))
  })

  return waitBlock(deployedContract)
}

const methodByHex = {
  '0x0a3b0a4f': 'addToWhitelist',
  '0x29092d0e': 'removeFromWhitelist',
  '0x211e28b6': 'setLocked',
  '0x0eed3f9f': 'setMessagingAddress',
  '44095ea7b3': 'setTokenApproval',
  '6423b872dd': 'sendTokens',
  '247065cb48': 'addMultisigSigner',
  '24173825d9': 'removeMultisigSigner',
  '24ba51a6df': 'changeRequirement'
}

export default {
  getCurrentAccount: () => currentAccount,
  methodByHex,
  init: async ({
    walletHost = web3Url,
    walletPort = web3Port,
    mnemonic,
    account,
    password
  }) => {
    const providerEngine = new Web3ProviderEngine()

    if (window.web3 && window.web3.currentProvider) {
      const currentProvider = new Web3(window.web3.currentProvider)

      promisifyAll(currentProvider.eth)

      const injectedWeb3Provider = {
        setEngine () {},
        handleRequest: async (payload, next, end) => {
          switch (payload.method) {
            case 'web3_clientVersion':
              return currentProvider.version.getNode(end)

            case 'eth_accounts':
              return currentProvider.eth.getAccounts(end)

            case 'eth_sendTransaction':
              return Promise.try(async () => {
                const [txParams] = payload.params
                const { to, from, data, gas } = txParams
                const methodHex = data.substr(data.length > 273 ? 264 : 0, 10)
                const method = methodByHex[methodHex]
                const transactionHash = await currentProvider.eth.sendTransactionAsync(txParams)

                store.dispatch({ type: 'WALLET_TRANSACTION_SUCCESS', transactionHash, methodHex, method, to, from, estimatedGasLimit: web3.toDecimal(gas) })

                return end(null, transactionHash)
              })
              .catch(e => {
                store.dispatch({ type: 'WALLET_TRANSACTION_ERROR', error: e.message || e })
                return end(e)
              })

            case 'eth_sign':
              const [address, message] = payload.params
              return currentProvider.eth.sign(address, message, end)

            default:
              next()
          }
        }
      }

      providerEngine.addProvider(injectedWeb3Provider)
    } else if (account && password) {
      providerEngine.addProvider(new Web3Subprovider(new Web3.providers.HttpProvider(`${walletHost}:${walletPort}`)))
    }

    // Use an RPC provider to route all other requests
    providerEngine.addProvider(new Web3Subprovider(new Web3.providers.HttpProvider(`${walletHost}:${walletPort}`, 0, 'n/a', store.getState().currentUser.accessToken)))  // TODO: implement redundantRPC

    providerEngine.start()

    web3 = new Web3(providerEngine)

    promisifyAll(web3.eth)
    promisifyAll(web3.personal)

    try {
      const accounts = await web3.eth.getAccountsAsync()
      currentAccount = account || accounts[0]

      if (account && password) {
        await web3.personal.unlockAccountAsync(currentAccount, password)
      }

      if (currentAccount) {
        store.dispatch({ type: 'WALLET_CONNECT_SUCCESS' })
      }

      pollForCurrentAccountUpdates()
    } catch (error) {
      console.error(`Error connecting to wallet on host ${walletHost}:${walletPort}, error: ${error}`)
      store.dispatch({ type: 'WALLET_CONNECT_ERROR', error })
    }
  },

  getAccounts: () => web3.eth.getAccountsAsync(),

  setCurrentAccount (address) {
    currentAccount = address
    // TODO: implement handling password and connecting to different wallet
  },

  addWhitelistToToken: async (whitelistAddress, tokenAddress) => {
    try {
      await waitForWeb3()

      store.dispatch({ type: 'WALLET_TRANSACTION_START', method: 'addWhitelistToToken' })
      const deployedSettingsStorageContract = await getStorageSettingsForToken(tokenAddress)
      promisifyAll(deployedSettingsStorageContract.addWhitelist)

      const gas = await deployedSettingsStorageContract.addWhitelist.estimateGasAsync(whitelistAddress, { from: currentAccount })

      await deployedSettingsStorageContract.addWhitelist.sendTransactionAsync(whitelistAddress, { from: currentAccount, gas })

      return store.dispatch({ type: 'WALLET_TRANSACTION_FINISHED', method: 'addWhitelistToToken' })
    } catch (e) {
      console.error(`Error adding whitelist ${whitelistAddress} to token ${tokenAddress} ${e.message}`)
      store.dispatch({ type: 'WALLET_TRANSACTION_ERROR', error: e.message || e })
      throw e
    }
  },

  addInvestorToWhitelist: async (investorAddress, contractAddress, kycStatus = '', kycExpDate = 0, accredStatus = '', jurisdiction = '') => {
    try {
      await waitForWeb3()

      store.dispatch({ type: 'WALLET_TRANSACTION_START', method: 'addInvestorToWhitelist' })

      const whitelist = getWhitelistFromAddress(contractAddress)

      const contract = web3.eth.contract(getAbi('whitelist', whitelist.abiVersion)).at(contractAddress)
      promisifyAll(contract.add)

      const gas = await contract.add.estimateGasAsync(investorAddress, kycStatus, kycExpDate, accredStatus, jurisdiction, { from: currentAccount })

      await contract.add.sendTransactionAsync(investorAddress, kycStatus, kycExpDate, accredStatus, jurisdiction, { from: currentAccount, gas })

      return store.dispatch({ type: 'WALLET_TRANSACTION_FINISHED', method: 'addInvestorToWhitelist' })
    } catch (e) {
      store.dispatch({ type: 'WALLET_TRANSACTION_ERROR', error: e.message || e })
      throw e
    }
  },

  addInvestorsToWhitelist: async (investorAddresses, contractAddress) => {
    try {
      await waitForWeb3()

      store.dispatch({ type: 'WALLET_TRANSACTION_START', method: 'addInvestorsToWhitelist' })

      const whitelist = getWhitelistFromAddress(contractAddress)

      const contract = web3.eth.contract(getAbi('whitelist', whitelist.abiVersion)).at(contractAddress)
      promisifyAll(contract.addBuyers)

      const gas = await contract.addBuyers.estimateGasAsync(investorAddresses, { from: currentAccount })

      await contract.addBuyers.sendTransactionAsync(investorAddresses, { from: currentAccount, gas })

      return store.dispatch({ type: 'WALLET_TRANSACTION_FINISHED', method: 'addInvestorsToWhitelist' })
    } catch (e) {
      store.dispatch({ type: 'WALLET_TRANSACTION_ERROR', error: e.message || e })
      throw e
    }
  },

  removeInvestorFromWhitelist: async (investorAddress, contractAddress) => {
    try {
      await waitForWeb3()

      store.dispatch({ type: 'WALLET_TRANSACTION_START', method: 'removeInvestorFromWhitelist' })

      const whitelist = getWhitelistFromAddress(contractAddress)

      const contract = web3.eth.contract(getAbi('whitelist', whitelist.abiVersion)).at(contractAddress)
      promisifyAll(contract.remove)

      const gas = await contract.remove.estimateGasAsync(investorAddress, { from: currentAccount })

      await contract.remove.sendTransactionAsync(investorAddress, { from: currentAccount, gas })

      return store.dispatch({ type: 'WALLET_TRANSACTION_FINISHED', method: 'removeInvestorFromWhitelist' })
    } catch (e) {
      store.dispatch({ type: 'WALLET_TRANSACTION_ERROR', error: e.message || e })
      throw e
    }
  },

  setMessagingAddress: async (messagingAddress, tokenAddress) => {
    try {
      await waitForWeb3()

      store.dispatch({ type: 'WALLET_TRANSACTION_START', method: 'setMessagingAddress' })

      const contract = await getStorageSettingsForToken(tokenAddress)

      const currentMessagingAddress = await contract.messagingAddress.callAsync()
      if (currentMessagingAddress !== messagingAddress) {
        const gas = await contract.setMessagingAddress.estimateGasAsync(messagingAddress, { from: currentAccount })

        await contract.setMessagingAddress.sendTransactionAsync(messagingAddress, { from: currentAccount, gas })
      }

      return store.dispatch({ type: 'WALLET_TRANSACTION_FINISHED', method: 'setMessagingAddress' })
    } catch (e) {
      store.dispatch({ type: 'WALLET_TRANSACTION_ERROR', error: e.message || e })
      throw e
    }
  },

  getTradingLock: async tokenAddress => {
    try {
      await waitForWeb3()

      const contract = await getStorageSettingsForToken(tokenAddress)

      return contract.locked.callAsync()
    } catch (e) {
      console.log(`getTradingLock error ${e.message || e}`)
      throw e
    }
  },

  setTradingLock: async (tokenAddress, locked) => {
    try {
      await waitForWeb3()

      store.dispatch({ type: 'WALLET_TRANSACTION_START', method: 'setTradingLock' })

      const contract = await getStorageSettingsForToken(tokenAddress)

      const gas = await contract.setLocked.estimateGasAsync(locked, { from: currentAccount })

      await contract.setLocked.sendTransactionAsync(locked, { from: currentAccount, gas })

      return store.dispatch({ type: 'WALLET_TRANSACTION_FINISHED', method: 'setTradingLock' })
    } catch (e) {
      store.dispatch({ type: 'WALLET_TRANSACTION_ERROR', error: e.message || e })
      throw e
    }
  },

  getBalanceForAddress: async (tokenAddress, investorAddress) => {
    try {
      await waitForWeb3()

      const token = getTokenFromAddress(tokenAddress)

      const contract = web3.eth.contract(getAbi('token', token.abiVersion)).at(tokenAddress)
      promisifyAll(contract.balanceOf)

      const balance = await contract.balanceOf.callAsync(investorAddress)

      return balance.toNumber()
    } catch (e) {
      console.log(`getBalanceForAddress error ${e.message || e}`)
      throw e
    }
  },

  getBuyerKyc: async (investorAddress, whitelistAddress) => {
    try {
      await waitForWeb3()

      const contract = web3.eth.contract(getAbi('whitelist')).at(whitelistAddress)
      promisifyAll(contract.getBuyerKyc)

      const kyc = await contract.getBuyerKyc.callAsync(investorAddress)

      return kyc
    } catch (e) {
      console.log(`getBuyerKyc error ${e.message || e}`)
      throw e
    }
  },

  getWhitelistsForToken: async tokenAddress => {
    try {
      await waitForWeb3()

      const deployedSettingsStorageContract = await getStorageSettingsForToken(tokenAddress)
      promisifyAll(deployedSettingsStorageContract.getWhitelists)

      return deployedSettingsStorageContract.getWhitelists.callAsync({ from: currentAccount })
    } catch (e) {
      console.log(`Error getting whitelists for token ${tokenAddress} ${e.message}`)
      return []
    }
  },

  getWhitelistsForUser: async (allWhitelists, user, tokens) => {
    await waitForWeb3()

    if (!tokens.length || !user.ethAddresses) { return [] }

    const whitelists = await reduce(tokens, async (result, token) => {
      let deployedSettingsStorageContract
      try {
        deployedSettingsStorageContract = await getStorageSettingsForToken(token.address)
        promisifyAll(deployedSettingsStorageContract.getWhitelists)
      } catch (e) {
        console.log(`Error getting token ${token.address} ${e.message}`)
        return result
      }

      const whitelistAddresses = await deployedSettingsStorageContract.getWhitelists.callAsync({ from: currentAccount })

      const filteredWhitelistAddresses = await filter(whitelistAddresses, async whitelistAddress => {
        const whitelist = allWhitelists.filter(({ address }) => address === whitelistAddress)[0]
        if (!whitelist) { return }

        const deployedWhitelistContract = web3.eth.contract(getAbi('whitelist', whitelist.abiVersion)).at(whitelistAddress)

        try {
          promisifyAll(deployedWhitelistContract.getAgentsOwnerAndQualifiers)

          const qualifiers = await deployedWhitelistContract.getAgentsOwnerAndQualifiers.callAsync({ from: currentAccount })

          return qualifiers.some(qualifier => user.ethAddresses.some(({ address }) => address === qualifier))
        } catch (e) {
          console.log(`Error getting qualifiers ${e.message}`)
        }
      })
      return result.concat(filteredWhitelistAddresses)
    }, [])
    .catch(e => {
      console.log(`Error getting whitelists: ${e.message}`)
      return []
    })

    return uniq(whitelists)
  },

  getRoleForWhitelist: async (user, whitelist) => {
    try {
      await waitForWeb3()

      const deployedWhitelistContract = web3.eth.contract(getAbi('whitelist', whitelist.abiVersion)).at(whitelist.address)

      promisifyAll(deployedWhitelistContract.getAgentsOwnerAndQualifiers)

      const qualifiers = await deployedWhitelistContract.getAgentsOwnerAndQualifiers.callAsync({ from: currentAccount })

      if (user.ethAddresses.some(({ address }) => address === qualifiers[0])) {
        return 'owner'
      } else if (user.ethAddresses.some(({ address }) => address === qualifiers[1])) {
        return 'agent'
      } else if (user.ethAddresses.some(({ address }) => qualifiers.some(qualifer => qualifer === address))) {
        return 'qualifer'
      } else {
        return 'none'
      }
    } catch (e) {
      console.log(`Error getting role for whitelist ${whitelist.address}: ${e.message}`)
      throw e
    }
  },

  confirmTransaction: async (id, multisigWalletAddress = '0xf6b4dc1a198b15bd09c5b48ac269a50889cfb51d') => {
    try {
      await waitForWeb3()

      store.dispatch({ type: 'WALLET_TRANSACTION_START', method: 'confirmTransaction' })

      const deployedWalletContract = web3.eth.contract(getAbi('multisig')).at(multisigWalletAddress)

      promisifyAll(deployedWalletContract.confirmTransaction)

      const gas = await deployedWalletContract.confirmTransaction.estimateGasAsync(id, { from: currentAccount })

      await deployedWalletContract.confirmTransaction.sendTransactionAsync(id, { from: currentAccount, gas })

      return store.dispatch({ type: 'WALLET_TRANSACTION_FINISHED', method: 'confirmTransaction' })
    } catch (e) {
      store.dispatch({ type: 'WALLET_TRANSACTION_ERROR', error: e.message || e })
      throw e
    }
  },

  revokeConfirmation: async (id, multisigWalletAddress = '0xf6b4dc1a198b15bd09c5b48ac269a50889cfb51d') => {
    try {
      await waitForWeb3()

      store.dispatch({ type: 'WALLET_TRANSACTION_START', method: 'revokeConfirmation' })

      const deployedWalletContract = web3.eth.contract(getAbi('multisig')).at(multisigWalletAddress)

      promisifyAll(deployedWalletContract.revokeConfirmation)

      const gas = await deployedWalletContract.revokeConfirmation.estimateGasAsync(id, { from: currentAccount })

      await deployedWalletContract.revokeConfirmation.sendTransactionAsync(id, { from: currentAccount, gas })

      return store.dispatch({ type: 'WALLET_TRANSACTION_FINISHED', method: 'revokeConfirmation' })
    } catch (e) {
      store.dispatch({ type: 'WALLET_TRANSACTION_ERROR', error: e.message || e })
      throw e
    }
  },

  setTokenApproval: async (tokenAddress, multisigWalletAddress = '0xf6b4dc1a198b15bd09c5b48ac269a50889cfb51d') => {
    try {
      await waitForWeb3()

      store.dispatch({ type: 'WALLET_TRANSACTION_START', method: 'setTokenApproval' })

      const token = getTokenFromAddress(tokenAddress)

      const deployedTokenContract = web3.eth.contract(getAbi('token', token.abiVersion)).at(tokenAddress)
      const deployedWalletContract = web3.eth.contract(getAbi('multisig')).at(multisigWalletAddress)

      promisifyAll(deployedWalletContract.submitTransaction)

      const approveEncoded = deployedTokenContract.approve.getData(multisigWalletAddress, 100, {from: multisigWalletAddress})

      const gas = await deployedWalletContract.submitTransaction.estimateGasAsync(tokenAddress, 0, approveEncoded, { from: currentAccount })

      await deployedWalletContract.submitTransaction.sendTransactionAsync(tokenAddress, 0, approveEncoded, { from: currentAccount, gas })

      return store.dispatch({ type: 'WALLET_TRANSACTION_FINISHED', method: 'setTokenApproval' })
    } catch (e) {
      store.dispatch({ type: 'WALLET_TRANSACTION_ERROR', error: e.message || e })
      throw e
    }
  },

  mint: async (tokenAddress, amount, multisigWalletAddress) => {
    try {
      await waitForWeb3()

      store.dispatch({ type: 'WALLET_TRANSACTION_START', method: 'mint' })

      const token = getTokenFromAddress(tokenAddress)

      const deployedTokenContract = web3.eth.contract(getAbi('token', token.abiVersion)).at(tokenAddress)

      const tokenOwner = await deployedTokenContract.owner.callAsync()

      if (multisigWalletAddress) {
        const deployedWalletContract = web3.eth.contract(getAbi('multisig')).at(multisigWalletAddress)

        promisifyAll(deployedWalletContract.submitTransaction)

        const txEncoded = deployedWalletContract.mint.getData(tokenOwner, amount, 0, { from: currentAccount })

        const gas = await deployedWalletContract.submitTransaction.estimateGasAsync(multisigWalletAddress, 0, txEncoded, { from: currentAccount })

        return deployedWalletContract.submitTransaction.sendTransactionAsync(multisigWalletAddress, 0, txEncoded, { from: currentAccount, gas })
      }

      const gas = await deployedTokenContract.mint.estimateGasAsync(tokenOwner, amount, 0, { from: currentAccount })

      await deployedTokenContract.mint.sendTransactionAsync(tokenOwner, amount, 0, { from: currentAccount, gas })

      return store.dispatch({ type: 'WALLET_TRANSACTION_FINISHED', method: 'mint' })
    } catch (e) {
      store.dispatch({ type: 'WALLET_TRANSACTION_ERROR', error: e.message || e })
      throw e
    }
  },

  transfer: async (tokenAddress, toAddress, amount) => {
    try {
      await waitForWeb3()

      store.dispatch({ type: 'WALLET_TRANSACTION_START', method: 'transfer' })

      const token = getTokenFromAddress(tokenAddress)

      const deployedTokenContract = web3.eth.contract(getAbi('token', token.abiVersion)).at(tokenAddress)

      const gas = await deployedTokenContract.transfer.estimateGasAsync(toAddress, amount, 0, { from: currentAccount })

      await deployedTokenContract.transfer.sendTransactionAsync(toAddress, amount, 0, { from: currentAccount, gas })

      return store.dispatch({ type: 'WALLET_TRANSACTION_FINISHED', method: 'arbitrate' })
    } catch (e) {
      store.dispatch({ type: 'WALLET_TRANSACTION_ERROR', error: e.message || e })
      throw e
    }
  },

  arbitrate: async (tokenAddress, fromAddress, toAddress, amount, multisigWalletAddress) => {
    try {
      await waitForWeb3()

      store.dispatch({ type: 'WALLET_TRANSACTION_START', method: 'arbitrate' })

      const token = getTokenFromAddress(tokenAddress)

      const deployedTokenContract = web3.eth.contract(getAbi('token', token.abiVersion)).at(tokenAddress)

      if (multisigWalletAddress) {
        const deployedWalletContract = web3.eth.contract(getAbi('multisig')).at(multisigWalletAddress)

        promisifyAll(deployedWalletContract.submitTransaction)

        const txEncoded = deployedWalletContract.arbitrage.getData(fromAddress, toAddress, amount, 0, { from: currentAccount })

        const gas = await deployedWalletContract.submitTransaction.estimateGasAsync(multisigWalletAddress, 0, txEncoded, { from: currentAccount })

        return deployedWalletContract.submitTransaction.sendTransactionAsync(multisigWalletAddress, 0, txEncoded, { from: currentAccount, gas })
      }

      const gas = await deployedTokenContract.arbitrage.estimateGasAsync(fromAddress, toAddress, amount, 0, { from: currentAccount })

      await deployedTokenContract.arbitrage.sendTransactionAsync(fromAddress, toAddress, amount, 0, { from: currentAccount, gas })

      return store.dispatch({ type: 'WALLET_TRANSACTION_FINISHED', method: 'arbitrate' })
    } catch (e) {
      store.dispatch({ type: 'WALLET_TRANSACTION_ERROR', error: e.message || e })
      throw e
    }
  },

  addSigner: async (signer, multisigWalletAddress = '0xf6b4dc1a198b15bd09c5b48ac269a50889cfb51d') => {
    try {
      await waitForWeb3()

      store.dispatch({ type: 'WALLET_TRANSACTION_START', method: 'addSigner' })

      const deployedWalletContract = web3.eth.contract(getAbi('multisig')).at(multisigWalletAddress)

      promisifyAll(deployedWalletContract.submitTransaction)

      const txEncoded = deployedWalletContract.addOwner.getData(signer, { from: currentAccount })

      const gas = await deployedWalletContract.submitTransaction.estimateGasAsync(multisigWalletAddress, 0, txEncoded, { from: currentAccount })

      await deployedWalletContract.submitTransaction.sendTransactionAsync(multisigWalletAddress, 0, txEncoded, { from: currentAccount, gas })

      return store.dispatch({ type: 'WALLET_TRANSACTION_FINISHED', method: 'addSigner' })
    } catch (e) {
      store.dispatch({ type: 'WALLET_TRANSACTION_ERROR', error: e.message || e })
      throw e
    }
  },

  removeSigner: async (signer, multisigWalletAddress = '0xf6b4dc1a198b15bd09c5b48ac269a50889cfb51d') => {
    try {
      await waitForWeb3()

      store.dispatch({ type: 'WALLET_TRANSACTION_START', method: 'removeSigner' })

      const deployedWalletContract = web3.eth.contract(getAbi('multisig')).at(multisigWalletAddress)

      promisifyAll(deployedWalletContract.submitTransaction)

      const txEncoded = deployedWalletContract.removeOwner.getData(signer, { from: currentAccount })

      const gas = await deployedWalletContract.submitTransaction.estimateGasAsync(multisigWalletAddress, 0, txEncoded, { from: currentAccount })

      await deployedWalletContract.submitTransaction.sendTransactionAsync(multisigWalletAddress, 0, txEncoded, { from: currentAccount, gas })

      return store.dispatch({ type: 'WALLET_TRANSACTION_FINISHED', method: 'removeSigner' })
    } catch (e) {
      store.dispatch({ type: 'WALLET_TRANSACTION_ERROR', error: e.message || e })
      throw e
    }
  },

  getCurrentRequirement: async (multisigWalletAddress = '0xf6b4dc1a198b15bd09c5b48ac269a50889cfb51d') => {
    try {
      await waitForWeb3()

      const deployedWalletContract = web3.eth.contract(getAbi('multisig')).at(multisigWalletAddress)

      promisifyAll(deployedWalletContract.required)

      const required = await deployedWalletContract.required.callAsync()

      return required.toNumber()
    } catch (e) {
      console.log(`getCurrentRequirement error ${e.message || e}`)
      throw e
    }
  },

  getOwners: async (multisigWalletAddress = '0xf6b4dc1a198b15bd09c5b48ac269a50889cfb51d') => {
    try {
      await waitForWeb3()

      const deployedWalletContract = web3.eth.contract(getAbi('multisig')).at(multisigWalletAddress)

      promisifyAll(deployedWalletContract.getOwners)

      return deployedWalletContract.getOwners.callAsync()
    } catch (e) {
      console.log(`getOwners error ${e.message || e}`)
      throw e
    }
  },

  changeRequirement: async (required, multisigWalletAddress = '0xf6b4dc1a198b15bd09c5b48ac269a50889cfb51d') => {
    try {
      await waitForWeb3()

      store.dispatch({ type: 'WALLET_TRANSACTION_START', method: 'changeRequirement' })

      const deployedWalletContract = web3.eth.contract(getAbi('multisig')).at(multisigWalletAddress)

      promisifyAll(deployedWalletContract.submitTransaction)

      const txEncoded = deployedWalletContract.changeRequirement.getData(required, { from: currentAccount })

      const gas = await deployedWalletContract.submitTransaction.estimateGasAsync(multisigWalletAddress, 0, txEncoded, { from: currentAccount })

      await deployedWalletContract.submitTransaction.sendTransactionAsync(multisigWalletAddress, 0, txEncoded, { from: currentAccount, gas })

      return store.dispatch({ type: 'WALLET_TRANSACTION_FINISHED', method: 'changeRequirement' })
    } catch (e) {
      store.dispatch({ type: 'WALLET_TRANSACTION_ERROR', error: e.message || e })
      throw e
    }
  },

  deployNewWhitelist: async (type, tokens = []) => {
    try {
      await waitForWeb3()

      store.dispatch({ type: 'WALLET_TRANSACTION_START', method: 'deployNewWhitelist' })

      const address = await deployContract('whitelist')

      const deployedWhitelistContract = web3.eth.contract(getAbi('whitelist')).at(address)
      promisifyAll(deployedWhitelistContract.addToken)

      each(tokens, async token => {
        const gas = await deployedWhitelistContract.addToken.estimateGasAsync(token.address, { from: currentAccount })

        deployedWhitelistContract.addToken.sendTransactionAsync(token.address, { from: currentAccount, gas })
      })

      store.dispatch({ type: 'WALLET_TRANSACTION_FINISHED', method: 'deployNewWhitelist' })

      return address
    } catch (e) {
      store.dispatch({ type: 'WALLET_TRANSACTION_ERROR', error: e.message || e })
      throw e
    }
  },

  deployNewToken: async (name, symbol, decimals = 0, initialOfferEndDate = 1, messagingAddress = 'messagingAddress') => {
    try {
      await waitForWeb3()

      store.dispatch({ type: 'WALLET_TRANSACTION_START', method: 'deployNewToken' })

      const storage = await deployContract('settingsStorage', false, true, initialOfferEndDate, messagingAddress)
      const service = await deployContract('regulatorService', storage)
      const address = await deployContract('token', service, name, symbol, decimals)

      store.dispatch({ type: 'WALLET_TRANSACTION_FINISHED', method: 'deployNewToken' })

      return address
    } catch (e) {
      store.dispatch({ type: 'WALLET_TRANSACTION_ERROR', error: e.message || e })
      throw e
    }
  }
}

import Web3 from 'web3'
import Web3ProviderEngine from 'web3-provider-engine'
import Web3Subprovider from 'web3-provider-engine/subproviders/web3'
import store from 'redux/store'
import Promise, { promisifyAll } from 'bluebird'

import whitelistContract from 'lib/contracts/IssuanceWhiteList'
import regDWhitelistContract from 'lib/contracts/RegulationDWhiteList'
import tokenContract from 'lib/contracts/RegulatedToken'
import regulatorServiceContract from 'lib/contracts/AboveboardRegDSWhitelistRegulatorService'
import settingsStorageContract from 'lib/contracts/SettingsStorage'
import multiSigArbitrationContract from 'lib/contracts/MultiSigArbitration'
import { url } from 'lib/feathers/local/feathersClient'

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

    if (attempts === 10) {
      console.log('Could not connect to wallet after 10 attempts')
    }

    return waitForWeb3()
  }
}

const getStorageSettingsForToken = async tokenAddress => {
  await waitForWeb3()

  const deployedTokenContract = web3.eth.contract(tokenContract.abi).at(tokenAddress)
  promisifyAll(deployedTokenContract._service)

  const regulatorServiceAddress = await deployedTokenContract._service.callAsync()
  const deployedRegulatorServiceContract = web3.eth.contract(regulatorServiceContract.abi).at(regulatorServiceAddress)
  promisifyAll(deployedRegulatorServiceContract.getStorageAddress)

  const storageAddress = await deployedRegulatorServiceContract.getStorageAddress.callAsync()
  const contract = web3.eth.contract(settingsStorageContract.abi).at(storageAddress)
  promisifyAll(contract.messagingAddress)
  promisifyAll(contract.setMessagingAddress)
  promisifyAll(contract.initialOfferEndDate)
  promisifyAll(contract.setInititalOfferEndDate)
  promisifyAll(contract.locked)
  promisifyAll(contract.setLocked)

  return contract
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
              .catch(error => {
                store.dispatch({ type: 'WALLET_TRANSACTION_ERROR', error: error.message || error })
                return end(error)
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
    } catch (error) {
      console.error(`Error connecting to wallet on host ${walletHost}:${walletPort}, error: ${error}`)
      store.dispatch({ type: 'WALLET_CONNECT_ERROR', error })
    }
  },

  getAccounts: async () => web3.eth.getAccountsAsync(),

  setCurrentAccount (address) {
    currentAccount = address
    // TODO: implement handling password and connecting to different wallet
  },

  addInvestorToWhitelist: async (investorAddress, contractAddress) => {
    await waitForWeb3()

    const contract = web3.eth.contract(whitelistContract.abi).at(contractAddress)
    promisifyAll(contract.add)

    const gas = await contract.add.estimateGasAsync(investorAddress, { from: currentAccount })

    return contract.add.sendTransactionAsync(investorAddress, { from: currentAccount, gas })
  },

  addInvestorsToWhitelist: async (investorAddresses, contractAddress) => {
    await waitForWeb3()

    const contract = web3.eth.contract(whitelistContract.abi).at(contractAddress)
    promisifyAll(contract.addBuyers)

    const gas = await contract.addBuyers.estimateGasAsync(investorAddresses, { from: currentAccount })

    return contract.addBuyers.sendTransactionAsync(investorAddresses, { from: currentAccount, gas })
  },

  removeInvestorFromWhitelist: async (investorAddress, contractAddress) => {
    await waitForWeb3()

    const contract = web3.eth.contract(whitelistContract.abi).at(contractAddress)
    promisifyAll(contract.remove)

    const gas = await contract.remove.estimateGasAsync(investorAddress, { from: currentAccount })

    return contract.remove.sendTransactionAsync(investorAddress, { from: currentAccount, gas })
  },

  setRegDWhitelistReleaseDate: async (investorAddress, contractAddress, releaseDate) => {
    await waitForWeb3()

    const contract = web3.eth.contract(regDWhitelistContract.abi).at(contractAddress)
    promisifyAll(contract.setReleaseDate)

    return contract.setReleaseDate.sendTransactionAsync(investorAddress, releaseDate, { from: currentAccount })
  },

  setMessagingAddress: async (messagingAddress, tokenAddress) => {
    await waitForWeb3()

    const contract = await getStorageSettingsForToken(tokenAddress)

    const currentMessagingAddress = await contract.messagingAddress.callAsync()
    if (currentMessagingAddress !== messagingAddress) {
      const gas = await contract.setMessagingAddress.estimateGasAsync(messagingAddress, { from: currentAccount })

      return contract.setMessagingAddress.sendTransactionAsync(messagingAddress, { from: currentAccount, gas })
    }
  },

  getTradingLock: async tokenAddress => {
    await waitForWeb3()

    const contract = await getStorageSettingsForToken(tokenAddress)

    return contract.locked.callAsync()
  },

  setTradingLock: async (tokenAddress, locked) => {
    await waitForWeb3()

    const contract = await getStorageSettingsForToken(tokenAddress)

    const gas = await contract.setLocked.estimateGasAsync(locked, { from: currentAccount })

    return contract.setLocked.sendTransactionAsync(locked, { from: currentAccount, gas })
  },

  getBalanceForAddress: async (tokenAddress, investorAddress) => {
    await waitForWeb3()

    const contract = web3.eth.contract(tokenContract.abi).at(tokenAddress)
    promisifyAll(contract.balanceOf)

    const balance = await contract.balanceOf.callAsync(investorAddress)

    return balance.toNumber()
  },

  getWhitelistsForBroker: async (user, tokens) => {
    if (!tokens.length) { return [] }

    console.log('getwhitelistforbroker token address ', tokens[0].address)

    const deployedSettingsStorageContract = await getStorageSettingsForToken(tokens[0].address)
    promisifyAll(deployedSettingsStorageContract.getWhitelists)

    const whitelistAddresses = await deployedSettingsStorageContract.getWhitelists.callAsync({ from: currentAccount })

    return whitelistAddresses

    // return filter(whitelistAddresses, async whitelistAddress => { TODO: reenable once getQualifiers is fixed
    //   const deployedWhitelistContract = web3.eth.contract(whitelistContract.abi).at(whitelistAddress)
    //   promisifyAll(deployedWhitelistContract.getQualifiers)

    //   const qualifiers = await deployedWhitelistContract.getQualifiers.callAsync({ from: currentAccount })

    //   return qualifiers.some(qualifier => user.ethAddresses.some(({ address }) => address === qualifier))
    // })
  },

  confirmTransaction: async (id, multisigWalletAddress = '0xf6b4dc1a198b15bd09c5b48ac269a50889cfb51d') => {
    await waitForWeb3()

    const deployedWalletContract = web3.eth.contract(multiSigArbitrationContract.abi).at(multisigWalletAddress)

    promisifyAll(deployedWalletContract.confirmTransaction)

    const gas = await deployedWalletContract.confirmTransaction.estimateGasAsync(id, {from: currentAccount})

    return deployedWalletContract.confirmTransaction.sendTransactionAsync(id, {from: currentAccount, gas})
  },

  revokeConfirmation: async (id, multisigWalletAddress = '0xf6b4dc1a198b15bd09c5b48ac269a50889cfb51d') => {
    await waitForWeb3()

    const deployedWalletContract = web3.eth.contract(multiSigArbitrationContract.abi).at(multisigWalletAddress)

    promisifyAll(deployedWalletContract.revokeConfirmation)

    const gas = await deployedWalletContract.revokeConfirmation.estimateGasAsync(id, {from: currentAccount})

    return deployedWalletContract.revokeConfirmation.sendTransactionAsync(id, {from: currentAccount, gas})
  },

  setTokenApproval: async (tokenAddress, multisigWalletAddress = '0xf6b4dc1a198b15bd09c5b48ac269a50889cfb51d') => {
    await waitForWeb3()

    const deployedTokenContract = web3.eth.contract(tokenContract.abi).at(tokenAddress)
    const deployedWalletContract = web3.eth.contract(multiSigArbitrationContract.abi).at(multisigWalletAddress)

    promisifyAll(deployedWalletContract.submitTransaction)

    const approveEncoded = deployedTokenContract.approve.getData(multisigWalletAddress, 100, {from: multisigWalletAddress})

    const gas = await deployedWalletContract.submitTransaction.estimateGasAsync(tokenAddress, 0, approveEncoded, {from: currentAccount})

    return deployedWalletContract.submitTransaction.sendTransactionAsync(tokenAddress, 0, approveEncoded, {from: currentAccount, gas})
  },

  sendTokens: async (tokenAddress, toAddress, amount, multisigWalletAddress = '0xf6b4dc1a198b15bd09c5b48ac269a50889cfb51d') => {
    await waitForWeb3()

    const deployedTokenContract = web3.eth.contract(tokenContract.abi).at(tokenAddress)
    const deployedWalletContract = web3.eth.contract(multiSigArbitrationContract.abi).at(multisigWalletAddress)

    promisifyAll(deployedWalletContract.submitTransaction)

    const transferEncoded = deployedTokenContract.transferFrom.getData(multisigWalletAddress, toAddress, amount, {from: multisigWalletAddress})

    const gas = await deployedWalletContract.submitTransaction.estimateGasAsync(tokenAddress, 0, transferEncoded, {from: currentAccount})

    return deployedWalletContract.submitTransaction.sendTransactionAsync(tokenAddress, 0, transferEncoded, {from: currentAccount, gas})
  },

  addSigner: async (signer, multisigWalletAddress = '0xf6b4dc1a198b15bd09c5b48ac269a50889cfb51d') => {
    await waitForWeb3()

    const deployedWalletContract = web3.eth.contract(multiSigArbitrationContract.abi).at(multisigWalletAddress)

    promisifyAll(deployedWalletContract.submitTransaction)

    const txEncoded = deployedWalletContract.addOwner.getData(signer, {from: currentAccount})

    const gas = await deployedWalletContract.submitTransaction.estimateGasAsync(multisigWalletAddress, 0, txEncoded, {from: currentAccount})

    return deployedWalletContract.submitTransaction.sendTransactionAsync(multisigWalletAddress, 0, txEncoded, {from: currentAccount, gas})
  },

  removeSigner: async (signer, multisigWalletAddress = '0xf6b4dc1a198b15bd09c5b48ac269a50889cfb51d') => {
    await waitForWeb3()

    const deployedWalletContract = web3.eth.contract(multiSigArbitrationContract.abi).at(multisigWalletAddress)

    promisifyAll(deployedWalletContract.submitTransaction)

    const txEncoded = deployedWalletContract.removeOwner.getData(signer, {from: currentAccount})

    const gas = await deployedWalletContract.submitTransaction.estimateGasAsync(multisigWalletAddress, 0, txEncoded, {from: currentAccount})

    return deployedWalletContract.submitTransaction.sendTransactionAsync(multisigWalletAddress, 0, txEncoded, {from: currentAccount, gas})
  },

  getCurrentRequirement: async (multisigWalletAddress = '0xf6b4dc1a198b15bd09c5b48ac269a50889cfb51d') => {
    await waitForWeb3()

    const deployedWalletContract = web3.eth.contract(multiSigArbitrationContract.abi).at(multisigWalletAddress)

    promisifyAll(deployedWalletContract.required)

    const required = await deployedWalletContract.required.callAsync()

    return required.toNumber()
  },

  getOwners: async (multisigWalletAddress = '0xf6b4dc1a198b15bd09c5b48ac269a50889cfb51d') => {
    await waitForWeb3()

    const deployedWalletContract = web3.eth.contract(multiSigArbitrationContract.abi).at(multisigWalletAddress)

    promisifyAll(deployedWalletContract.getOwners)

    return deployedWalletContract.getOwners.callAsync()
  },

  changeRequirement: async (required, multisigWalletAddress = '0xf6b4dc1a198b15bd09c5b48ac269a50889cfb51d') => {
    await waitForWeb3()

    const deployedWalletContract = web3.eth.contract(multiSigArbitrationContract.abi).at(multisigWalletAddress)

    promisifyAll(deployedWalletContract.submitTransaction)

    const txEncoded = deployedWalletContract.changeRequirement.getData(required, {from: currentAccount})

    const gas = await deployedWalletContract.submitTransaction.estimateGasAsync(multisigWalletAddress, 0, txEncoded, {from: currentAccount})

    return deployedWalletContract.submitTransaction.sendTransactionAsync(multisigWalletAddress, 0, txEncoded, {from: currentAccount, gas})
  }
}

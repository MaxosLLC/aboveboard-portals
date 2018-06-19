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
import walletContract from 'lib/contracts/MultiSigArbitration'

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
  promisifyAll(contract.getMessagingAddress)
  promisifyAll(contract.setMessagingAddress)
  promisifyAll(contract.getInititalOfferEndDate)
  promisifyAll(contract.setInititalOfferEndDate)
  promisifyAll(contract.getLocked)
  promisifyAll(contract.setLocked)

  return contract
}

export default {
  methodByHex: {
    '0x0a3b0a4f': 'addToWhitelist',
    '0x29092d0e': 'removeFromWhitelist',
    '0x89ad0a34': 'setLocked',
    '0xa256b4d0': 'setMessagingAddress'
  },
  init: async ({
    walletHost = window.REACT_APP_APP_TYPE ? 'https://mainnet.infura.io/O4y6ossOQVPXYvf8PDB4' : (process.env.REACT_APP_WALLET_HOST || 'https://kovan.infura.io/V7nB2kBfEei6IhVFeI7W'),
    walletPort = process.env.REACT_APP_WALLET_PORT || '443',
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
                const methodHex = data.substr(0, 10)

                const transactionHash = await currentProvider.eth.sendTransactionAsync(txParams)
                store.dispatch({ type: 'WALLET_TRANSACTION_SUCCESS', transactionHash, methodHex, to, from, estimatedGasLimit: web3.toDecimal(gas) })
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
    if (process.env.REACT_APP_NODE_ENV === 'local-dev') {
      providerEngine.addProvider(new Web3Subprovider(new Web3.providers.HttpProvider(`${walletHost}:${walletPort}`)))
    } else if (window.REACT_APP_APP_TYPE) {
      providerEngine.addProvider(new Web3Subprovider(new Web3.providers.HttpProvider('https://mainnet.infura.io/O4y6ossOQVPXYvf8PDB4')))
    } else if (process.env.REACT_APP_NODE_ENV !== 'test') {
      providerEngine.addProvider(new Web3Subprovider(new Web3.providers.HttpProvider('https://kovan.infura.io/O4y6ossOQVPXYvf8PDB4'))) // TODO: implement redundantRPC
    }

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
    const contract = web3.eth.contract(whitelistContract.abi).at(contractAddress)
    promisifyAll(contract.add)

    const gas = await contract.add.estimateGasAsync(investorAddress, { from: currentAccount })

    return contract.add.sendTransactionAsync(investorAddress, { from: currentAccount, gas })
  },

  addInvestorsToWhitelist: async (investorAddresses, contractAddress) => {
    const contract = web3.eth.contract(whitelistContract.abi).at(contractAddress)
    promisifyAll(contract.addBuyers)

    const gas = await contract.addBuyers.estimateGasAsync(investorAddresses, { from: currentAccount })

    return contract.addBuyers.sendTransactionAsync(investorAddresses, { from: currentAccount, gas })
  },

  removeInvestorFromWhitelist: async (investorAddress, contractAddress) => {
    const contract = web3.eth.contract(whitelistContract.abi).at(contractAddress)
    promisifyAll(contract.remove)

    const gas = await contract.remove.estimateGasAsync(investorAddress, { from: currentAccount })

    return contract.remove.sendTransactionAsync(investorAddress, { from: currentAccount, gas })
  },

  setRegDWhitelistReleaseDate: async (investorAddress, contractAddress, releaseDate) => {
    const contract = web3.eth.contract(regDWhitelistContract.abi).at(contractAddress)
    promisifyAll(contract.setReleaseDate)

    return contract.setReleaseDate.sendTransactionAsync(investorAddress, releaseDate, { from: currentAccount })
  },

  setMessagingAddress: async (messagingAddress, tokenAddress) => {
    const contract = await getStorageSettingsForToken(tokenAddress)

    const currentMessagingAddress = await contract.getMessagingAddress.callAsync(tokenAddress)
    if (currentMessagingAddress !== messagingAddress) {
      const gas = await contract.setMessagingAddress.estimateGasAsync(tokenAddress, messagingAddress, { from: currentAccount })

      return contract.setMessagingAddress.sendTransactionAsync(tokenAddress, messagingAddress, { from: currentAccount, gas })
    }
  },

  getTradingLock: async tokenAddress => {
    const contract = await getStorageSettingsForToken(tokenAddress)

    return contract.getLocked.callAsync(tokenAddress)
  },

  setTradingLock: async (tokenAddress, locked) => {
    const contract = await getStorageSettingsForToken(tokenAddress)

    const gas = await contract.setLocked.estimateGasAsync(tokenAddress, locked, { from: currentAccount })

    return contract.setLocked.sendTransactionAsync(tokenAddress, locked, { from: currentAccount, gas })
  },

  getBalanceForAddress: async (tokenAddress, investorAddress) => {
    await waitForWeb3()

    const contract = web3.eth.contract(tokenContract.abi).at(tokenAddress)
    promisifyAll(contract.balanceOf)

    const balance = await contract.balanceOf.callAsync(investorAddress)

    return balance.toNumber()
  },

  approveTx: async (id) => {
    const walletAddress = '0x0A9f6Ae7DD5966aeFF70B0cb3231056AFF8AeDB9'
    const deployedWalletContract = web3.eth.contract(walletContract.abi).at(walletAddress)

    promisifyAll(deployedWalletContract.confirmTransaction)

    const gas = await deployedWalletContract.confirmTransaction.estimateGasAsync(id, {from: currentAccount})

    return deployedWalletContract.confirmTransaction.sendTransactionAsync(id, {from: currentAccount, gas})
  },

  setTokenApproval: async (tokenAddress) => {
    const walletAddress = '0x0A9f6Ae7DD5966aeFF70B0cb3231056AFF8AeDB9'
    const deployedTokenContract = web3.eth.contract(tokenContract.abi).at(tokenAddress)
    const deployedWalletContract = web3.eth.contract(walletContract.abi).at(walletAddress)

    promisifyAll(deployedWalletContract.submitTransaction)

    const approveEncoded = deployedTokenContract.approve.getData(walletAddress, 100, {from: walletAddress})

    const gas = await deployedWalletContract.submitTransaction.estimateGasAsync(tokenAddress, 0, approveEncoded, {from: currentAccount})

    return deployedWalletContract.submitTransaction.sendTransactionAsync(tokenAddress, 0, approveEncoded, {from: currentAccount, gas})
  },

  sendTokens: async (tokenAddress) => {
    const walletAddress = '0x0A9f6Ae7DD5966aeFF70B0cb3231056AFF8AeDB9'
    const deployedTokenContract = web3.eth.contract(tokenContract.abi).at(tokenAddress)
    const deployedWalletContract = web3.eth.contract(walletContract.abi).at(walletAddress)

    promisifyAll(deployedWalletContract.submitTransaction)

    const transferEncoded = deployedTokenContract.transferFrom.getData(walletAddress, currentAccount, 100, {from: walletAddress})

    const gas = await deployedWalletContract.submitTransaction.estimateGasAsync(tokenAddress, 0, transferEncoded, {from: currentAccount})

    return deployedWalletContract.submitTransaction.sendTransactionAsync(tokenAddress, 0, transferEncoded, {from: currentAccount, gas})
  },

  addSigner: async (signer) => {
    const walletAddress = '0x0A9f6Ae7DD5966aeFF70B0cb3231056AFF8AeDB9'
    const deployedWalletContract = web3.eth.contract(walletContract.abi).at(walletAddress)

    promisifyAll(deployedWalletContract.submitTransaction)

    const txEncoded = deployedWalletContract.addOwner.getData(signer, {from: currentAccount})

    const gas = await deployedWalletContract.submitTransaction.estimateGasAsync(walletAddress, 0, txEncoded, {from: currentAccount})

    return deployedWalletContract.submitTransaction.sendTransactionAsync(walletAddress, 0, txEncoded, {from: currentAccount, gas})
  },

  removeSigner: async (signer) => {
    const walletAddress = '0x0A9f6Ae7DD5966aeFF70B0cb3231056AFF8AeDB9'
    const deployedWalletContract = web3.eth.contract(walletContract.abi).at(walletAddress)

    promisifyAll(deployedWalletContract.submitTransaction)

    const txEncoded = deployedWalletContract.removeOwner.getData(signer, {from: currentAccount})

    const gas = await deployedWalletContract.submitTransaction.estimateGasAsync(walletAddress, 0, txEncoded, {from: currentAccount})

    return deployedWalletContract.submitTransaction.sendTransactionAsync(walletAddress, 0, txEncoded, {from: currentAccount, gas})
  },

  changeRequirement: async (required) => {
    const walletAddress = '0x0A9f6Ae7DD5966aeFF70B0cb3231056AFF8AeDB9'
    const deployedWalletContract = web3.eth.contract(walletContract.abi).at(walletAddress)

    promisifyAll(deployedWalletContract.submitTransaction)

    const txEncoded = deployedWalletContract.changeRequirement.getData(required, {from: currentAccount})

    const gas = await deployedWalletContract.submitTransaction.estimateGasAsync(walletAddress, 0, txEncoded, {from: currentAccount})

    return deployedWalletContract.submitTransaction.sendTransactionAsync(walletAddress, 0, txEncoded, {from: currentAccount, gas})
  }
}

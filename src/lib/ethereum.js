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
  console.log('get storage settings for token ', tokenAddress)
  const deployedTokenContract = web3.eth.contract(tokenContract.abi).at(tokenAddress)
  promisifyAll(deployedTokenContract._service)

  const regulatorServiceAddress = await deployedTokenContract._service.callAsync()
  console.log('reg servive address ', regulatorServiceAddress)
  const deployedRegulatorServiceContract = web3.eth.contract(regulatorServiceContract.abi).at(regulatorServiceAddress)
  promisifyAll(deployedRegulatorServiceContract.getStorageAddress)

  const storageAddress = await deployedRegulatorServiceContract.getStorageAddress.callAsync()
  console.log('storage address ', storageAddress)
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
  init: async ({
    walletHost = process.env.REACT_APP_WALLET_HOST || 'https://kovan.infura.io/V7nB2kBfEei6IhVFeI7W',
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

                const data = await currentProvider.eth.sendTransactionAsync(txParams)
                store.dispatch({ type: 'WALLET_TRANSACTION_SUCCESS' })
                return end(null, data)
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

    const balance = await contract.balanceOf.callAsync(tokenAddress)
console.log('balance type ', typeof balance)
console.log('balance ', balance)
console.log('balance keysd', Object.keys(balance))
console.log('balance json ', JSON.stringify(balance.null, 2))
    return balance
  }
}

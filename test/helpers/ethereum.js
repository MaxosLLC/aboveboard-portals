const Web3 = require('web3')
const { promisifyAll } = require('bluebird')
const RegulatedTokenABI = require('../../src/lib/contracts/RegulatedToken').abi

const web3 = new Web3(new Web3.providers.HttpProvider(`${process.env.REACT_APP_WALLET_HOST || 'http://testrpc'}:${process.env.REACT_APP_WALLET_PORT || 8547}`))

const currentAccount = web3.eth.accounts[0]

promisifyAll(web3.eth)

web3.personal.unlockAccount(currentAccount, 'test')

const regulatedToken = web3.eth.contract(RegulatedTokenABI).at('0x7abd87877fe075d41131adcabbf6f1b7b3b3f0d9')
promisifyAll(regulatedToken.mint)
promisifyAll(regulatedToken.transfer)

const transfer = (to, amount) =>
  regulatedToken.mint.sendTransactionAsync(currentAccount, 1000000, { from: currentAccount })
    .then(() => regulatedToken.transfer.sendTransactionAsync(to, amount, { from: currentAccount }))
  

module.exports = { transfer }

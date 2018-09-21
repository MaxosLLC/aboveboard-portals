import React, { Component } from 'react'
import { Segment } from 'semantic-ui-react'

class WalletView extends Component {
  render () {
    return (
      <Segment className='descriptionPageHeader'>
        Your local Ethereum wallet will allow you to put information on the chain, such as securities, whitelists, and the Ethereum addresses for whitelisted owners.<br /><br />
        This registry is currently running on <a href='https://kovan-testnet.github.io/website/' target='_blank' rel='noopener noreferrer'>the Kovan network</a>.<br /><br />
        You can download and install the MetaMask chrome extension <a href='https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en' target='_blank' rel='noopener noreferrer'>here</a>.<br /><br />
        In order to complete transactions you will need to use Ether, which belngs to your Ethereum address.  To obtain some Ether for free for testing on the Kovan network, simply join the <a href='https://gitter.im/kovan-testnet/faucet' target='_target' rel='noopener noreferrer'>Kovan faucet gitter</a> and post your Ethereum address and some will be sent to you shortly.<br /><br />
        Once you have logged in with your wallet you will need to refresh the page for it to connect properly.
      </Segment>
    )
  }
}

export default WalletView

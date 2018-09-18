import React, { Component } from 'react'
import { Segment } from 'semantic-ui-react'

class WalletView extends Component {
  render () {
    const { connected } = this.props

    return (
      connected
        ? <div className='walletComponent'>
          <Segment className='descriptionPageHeader'>
            Log in with your MetaMask wallet
          </Segment>
          <Segment className='descriptionPageHeader'>
            This will allow you to put information on the Ethereum chain, such as securities, whitelists, and the ethereum addresses for whitelisted owners
          </Segment>
        </div>
        : <div className='walletComponent'>
          <Segment className='descriptionPageHeader'>
            Log in with your MetaMask wallet
          </Segment>
          <Segment className='descriptionPageHeader'>
            This will allow you to put information on the Ethereum chain, such as securities, whitelists, and the ethereum addresses for whitelisted owners
          </Segment>
        </div>
    )
  }
}

export default WalletView

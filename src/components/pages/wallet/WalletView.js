import React, { Component } from 'react'
import { Segment } from 'semantic-ui-react'

class WalletView extends Component {
  render () {
    const { connected } = this.props

    return (
      <Segment className='descriptionPageHeader'>
        Your local Ethereum wallet will allow you to put information on the chain, such as securities, whiteslists, and the Ethereum addresses for whitelisted owners.
      </Segment>
    )
  }
}

export default WalletView

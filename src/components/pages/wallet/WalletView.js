import React, { Component } from 'react'
import { Segment } from 'semantic-ui-react'

class WalletView extends Component {
  render () {
    return (
      <Segment className='descriptionPageHeader'>
        Your local Ethereum wallet will allow you to put information on the chain, such as securities, whitelists, and the Ethereum addresses for whitelisted owners.
      </Segment>
    )
  }
}

export default WalletView

import React, { Component } from 'react'
import CreateWhitelistForm from 'components/forms/whitelists/CreateWhitelistForm'

class CreateWhitelistView extends Component {
  render () {
    const { createWhitelist, connected } = this.props

    return (
      <div className='createWhitelistsComponent'>
        { !connected ? 'Please connect your wallet.' : <CreateWhitelistForm onSubmit={createWhitelist} /> }
      </div>
    )
  }
}

export default CreateWhitelistView

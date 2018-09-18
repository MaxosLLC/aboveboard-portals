import React, { Component } from 'react'
import CreateWhitelistForm from 'components/forms/whitelists/CreateWhitelistForm'

class CreateWhitelistView extends Component {
  render () {
    const { createWhitelist, connected } = this.props

    return (
      <div className='createWhitelistsComponent' style={{ width: '400px', margin: '0 auto' }}>
        { !connected ? 'Please connect your wallet.' : <CreateWhitelistForm onSubmit={createWhitelist} /> }
      </div>
    )
  }
}

export default CreateWhitelistView

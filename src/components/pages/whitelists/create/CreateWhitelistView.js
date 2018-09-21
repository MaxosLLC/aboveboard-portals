import React, { Component } from 'react'
import CreateWhitelistForm from 'components/forms/whitelists/CreateWhitelistForm'
import { Link } from 'react-router-dom'

class CreateWhitelistView extends Component {
  render () {
    const { createWhitelist, connected } = this.props

    return (
      <div className='createWhitelistsComponent' style={{ width: '400px', margin: '0 auto' }}>
        { !connected ? <span>Please connect your <Link to='/wallet'>wallet</Link>.</span> : <CreateWhitelistForm onSubmit={createWhitelist} /> }
      </div>
    )
  }
}

export default CreateWhitelistView

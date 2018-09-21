import React, { Component } from 'react'
import CreateTokenForm from 'components/forms/securities/CreateTokenForm'
import { Link } from 'react-router-dom'

class CreateTokenView extends Component {
  render () {
    const { createToken, connected } = this.props

    return (
      <div className='createTokensComponent' style={{ width: '400px', margin: '0 auto' }}>
        { !connected ? <span>Please connect your <Link to='/wallet'>wallet</Link>.</span> : <CreateTokenForm onSubmit={createToken} /> }
      </div>
    )
  }
}

export default CreateTokenView

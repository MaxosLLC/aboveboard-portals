import React, { Component } from 'react'
import CreateTokenForm from 'components/forms/securities/CreateTokenForm'

class CreateTokenView extends Component {
  render () {
    const { createToken, connected } = this.props

    return (
      <div className='createTokensComponent' style={{ width: '400px', margin: '0 auto' }}>
        { !connected ? 'Please connect your wallet.' : <CreateTokenForm onSubmit={createToken} /> }
      </div>
    )
  }
}

export default CreateTokenView

import React, { Component } from 'react'
import CreateTokenForm from 'components/forms/tokens/CreateTokenForm'

class CreateTokenView extends Component {
  render () {
    const { createToken, connected } = this.props

    return (
      <div className='createTokensComponent'>
        { !connected ? 'Please connect your wallet.' : <CreateTokenForm onSubmit={createToken} /> }
      </div>
    )
  }
}

export default CreateTokenView

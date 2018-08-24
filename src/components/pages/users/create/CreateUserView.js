import React, { Component } from 'react'
import CreateUserForm from 'components/forms/users/CreateUserForm'

class CreateUserView extends Component {
  render () {
    const { createUser, connected } = this.props

    return (
      <div className='createUsersComponent'>
        { !connected ? 'Please connect your wallet.' : <CreateUserForm onSubmit={createUser} /> }
      </div>
    )
  }
}

export default CreateUserView

import React, { Component } from 'react'
import CreateUserForm from 'components/forms/users/CreateUserForm'

class CreateUserView extends Component {
  render () {
    const { createUser } = this.props

    return (
      <div className='createUsersComponent'>
        <CreateUserForm onSubmit={createUser} />
      </div>
    )
  }
}

export default CreateUserView

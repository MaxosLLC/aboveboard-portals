import React, { Component } from 'react'
import AddInvestorForm from 'components/forms/investor/AddInvestorForm'

class AddInvestorView extends Component {
  render () {
    const { addInvestor, connected } = this.props

    return (
      <div className='addInvestorsComponent'>
        { !connected ? 'Please connect your wallet.' : <AddInvestorForm onSubmit={addInvestor} /> }
      </div>
    )
  }
}

export default AddInvestorView

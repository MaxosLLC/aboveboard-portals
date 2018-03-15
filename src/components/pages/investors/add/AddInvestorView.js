import React, { Component } from 'react'
import AddInvestorForm from 'components/forms/investor/AddInvestorForm'

class AddInvestorView extends Component {
  render () {
    const { addInvestor } = this.props

    return (
      <div className='addInvestorsComponent'>
        <AddInvestorForm onSubmit={addInvestor} />
      </div>
    )
  }
}

export default AddInvestorView

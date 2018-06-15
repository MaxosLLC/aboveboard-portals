import React, { Component } from 'react'
import { Header, Segment } from 'semantic-ui-react'

class PendingTransactionsView extends Component {
  render () {
    return (
      <div className='pendingTransactionsComponent'>
        <Header as='h2'>Pending Transactions</Header><br />
        <Segment>There are currently no transactions.</Segment>
      </div>
    )
  }
}

export default PendingTransactionsView

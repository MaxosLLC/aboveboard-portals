import React, { Component } from 'react'
import { Button, Header, Segment } from 'semantic-ui-react'

class MultisigWalletsView extends Component {
  render () {
    return (
      <div className='multisigWalletsComponent'>
        <Segment><Header as='h3'>Wallet Address 0xf6b4dc1a198b15bd09c5b48ac269a50889cfb51d</Header></Segment><br />
        <Header as='h5'>Actions:</Header><br />
        <Button primary>Change Wallet Address</Button><br /><br />
        <Button primary>Security Replacement</Button><br /><br />
        <Button primary>Issue New Securities</Button><br /><br />
        <Button primary>Assign Issuer</Button><br /><br />
        <Button primary>Add Multisig Signer</Button><br /><br />
        <Button primary>Remove Multisig Signer</Button><br /><br />
        <br />
        <Segment><Header as='h4'>You currently have 0 transactions awaiting confirmation</Header></Segment>
        <br />
        <Button primary>View Pending Transactions</Button><br /><br />
      </div>
    )
  }
}

export default MultisigWalletsView

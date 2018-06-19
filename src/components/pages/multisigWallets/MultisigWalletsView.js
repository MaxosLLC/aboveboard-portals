import React, { Component } from 'react'
import { Button, Header, Segment } from 'semantic-ui-react'

class MultisigWalletsView extends Component {
  render () {
    const { setTokenApproval, approveTx, sendTokens, addSigner, removeSigner, changeRequirement } = this.props
    return (
      <div className='multisigWalletsComponent'>
        <Segment><Header as='h3'>You currently have 0 transactions awaiting confirmation</Header></Segment>
        <Header as='h4'>Company Governance Actions:</Header><br />
        <Button primary>Change Wallet Address</Button><br /><br />
        <Button primary>Security Replacement</Button><br /><br />
        <Button primary>Issue New Securities</Button><br /><br />
        <Button primary>Assign Issuer</Button><br /><br />
        <br />
        <Button onClick={addSigner} primary>Add Multisig Signer</Button><br /><br />
        <Button onClick={removeSigner} primary>Remove Multisig Signer</Button><br /><br />
        <Button onClick={changeRequirement} primary>Change Requirement</Button><br /><br />
        <br />
        <Button onClick={setTokenApproval} primary>Set Token Approval</Button><br /><br />
        <Button onClick={approveTx} primary>Approve tx</Button><br /><br />
        <Button onClick={sendTokens} primary>Send Tokens</Button><br /><br />
        <br />
        <Segment><Header as='h5'>Wallet Address 0xf6b4dc1a198b15bd09c5b48ac269a50889cfb51d</Header></Segment><br />
      </div>
    )
  }
}

export default MultisigWalletsView

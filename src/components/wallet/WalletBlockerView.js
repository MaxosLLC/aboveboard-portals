import React, { Component } from 'react'
import { Header, Grid, Segment } from 'semantic-ui-react'

class WalletBlockerView extends Component {
  render () {
    const { processing, method } = this.props

    return (
      processing
        ? <div style={{ position: 'fixed', height: '100%', width: '100%', zIndex: '1000000', top: '0', left: '0', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <Grid textAlign='center' style={{ position: 'relative', top: '4em' }}>
            <Grid.Column style={{ maxWidth: 600 }}>
              { method === 'deployNewToken'
                ? <Segment size='large' textAlign='center'>
                  <Header>Your new Token contract is now deploying...</Header>
                  <Header>There will 3 transactions following that must be confirmed.</Header>
                  <Header>Please confirm all transactions with your wallet.</Header>
                  <Header>If your wallet does not load, please open it manually or refresh the page.</Header>
                </Segment>
              : method === 'deployNewWhitelist'
                ? <Segment size='large' textAlign='center'>
                  <Header>Your new Whitelist is now being deployed...</Header>
                  <Header>There will 4 or more transactions following that must be confirmed.</Header>
                  <Header>Please confirm all transactions with your wallet.</Header>
                  <Header>If your wallet does not load, please open it manually or refresh the page.</Header>
                </Segment>
              : method === 'changeToKovanNetwork'
                ? <Segment size='large' textAlign='center'>
                  <Header>Your wallet is currently targetting the wrong Ethereum network.</Header>
                  <Header>Please connect your wallet to the Kovan network.</Header>
                </Segment>
              : <Segment size='large' textAlign='center'>
                <Header>Your wallet is now loading...</Header>
                <Header>Please complete any outstanding transactions.</Header>
                <Header>If your wallet does not load, please open it manually or refresh the page.</Header>
              </Segment>
              }
            </Grid.Column>
          </Grid>
        </div>
      : null
    )
  }
}

export default WalletBlockerView

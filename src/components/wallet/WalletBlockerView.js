import React, { Component } from 'react'
import { Header, Grid, Segment } from 'semantic-ui-react'

class WalletBlockerView extends Component {
  render () {
    const { processing } = this.props

    return (
      processing
        ? <div style={{ position: 'absolute', height: '100%', width: '100%', zIndex: '1000000', top: '0', left: '0', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <Grid textAlign='center' style={{ position: 'relative', top: '4em' }}>
            <Grid.Column style={{ maxWidth: 360 }}>
              <Segment size='large' textAlign='center'>
                <Header>Your wallet is now loading...</Header>
                <Header>Please complete any outstanding transactions.</Header>
                <Header>If your wallet does not load, please refresh the page.</Header>
              </Segment>
            </Grid.Column>
          </Grid>
        </div>
      : null
    )
  }
}

export default WalletBlockerView

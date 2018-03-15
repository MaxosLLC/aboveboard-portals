import React, { Component } from 'react'
import { differenceBy } from 'lodash'
import { Button, Divider, Dropdown, Header, Grid, Icon, Input, Label, Segment } from 'semantic-ui-react'

class SettingsView extends Component {
  render () {
    const { loaded, connected, connectWallet, tokens, watchingTokens, startWatchingToken, stopWatchingToken } = this.props

    const watchingTokenOptions = tokens.map(token => {
      return {
        text: token.name,
        value: token.address
      }
    })

    const handleConnectWallet = () => {
      const account = document.getElementById('wallet-account-input').value
      const password = document.getElementById('wallet-password-input').value

      if (!account) {
        return alert('Please enter account address') // eslint-disable-line
      }

      if (!password) {
        return alert('Please enter your account password') // eslint-disable-line
      }

      return connectWallet(account, password)
    }

    const handleChangeWatchingTokens = () => {
      const addedTokens = differenceBy(this.watchingTokensValue, watchingTokens, 'address')
      const removedTokens = differenceBy(watchingTokens, this.watchingTokensValue, 'address')

      addedTokens.forEach(startWatchingToken)
      removedTokens.forEach(stopWatchingToken)
    }

    return (
      <div className='settingsComponent'>
        <Grid centered columns={1}>
          <Grid.Column width={4}>
            <Segment>
              <Header as='h2' textAlign='center'>Settings</Header>
            </Segment>
          </Grid.Column>
        </Grid>

        <br />

        { !loaded ? <span>Loading settings...<Icon name='spinner' loading /></span>
          : <div>
            <Segment>
              <Header as='h3'>Watching Tokens</Header>
              <Dropdown
                selection
                search
                multiple
                name='watchingTokens'
                defaultValue={watchingTokens.map(token => token.address)}
                options={watchingTokenOptions}
                onChange={(e, {value}) => { this.watchingTokensValue = value.map(val => ({ address: val })) }}
                />
              <br />
              <br />
              <Button onClick={handleChangeWatchingTokens}>Save</Button>
            </Segment>

            <Segment>
                Wallet Connection Status <Label color={connected ? 'green' : 'red'}>{ connected ? 'Connected' : 'Disconnected' }</Label>
              { !connected
                  ? <div>
                    <Divider />
                    <Label>Account</Label>
                    <Input id='wallet-account-input' name='wallet-account' autoComplete='new-password' />
                    <br />
                    <Label>Password</Label>
                    <Input id='wallet-password-input' name='wallet-password' type='password' autoComplete='new-password' />
                    <br />
                    <Button onClick={handleConnectWallet}>Connect</Button>
                  </div>
                  : '' }
            </Segment>
          </div>
        }
      </div>
    )
  }
}

export default SettingsView

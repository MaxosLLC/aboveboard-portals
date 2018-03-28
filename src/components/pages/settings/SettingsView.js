import React, { Component } from 'react'
import { differenceBy } from 'lodash'
import { Divider, Dropdown, Header, Icon, Input, Label, Segment, Form, Message } from 'semantic-ui-react'
import Button from '../../inputs/button/Button'
import './Settings.css'

class SettingsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messageVisible: true
    };
  }

  render () {
    const { messageVisible } = this.state
    const { loaded, appType, connected, connectWallet, currentUser, tokens, watchingTokens, startWatchingToken, stopWatchingToken, setMessagingAddress } = this.props

    const watchingTokenOptions = tokens.map(token => {
      return {
        text: token.name,
        value: token.address
      }
    })

    const handleConnectWallet = () => {
      // const account = document.getElementById('wallet-account-input').value
      // const password = document.getElementById('wallet-password-input').value

      // if (!account) {
      //   return alert('Please enter account address') // eslint-disable-line
      // }

      // if (!password) {
      //   return alert('Please enter your account password') // eslint-disable-line
      // }

      // return connectWallet(account, password)
    }

    // const handleChangeWatchingTokens = () => {console.log(234)
    //   const addedTokens = differenceBy(this.watchingTokensValue, watchingTokens, 'address')
    //   const removedTokens = differenceBy(watchingTokens, this.watchingTokensValue, 'address')

    //   addedTokens.forEach(startWatchingToken)
    //   removedTokens.forEach(stopWatchingToken)
    // }

    const handleSetMessagingAccount = () => {
      const messagingAddress = document.getElementById('messaging-account-input').value

      if (!messagingAddress) {
        return alert('Please enter a messaging address') // eslint-disable-line
      }

      setMessagingAddress(messagingAddress, watchingTokens)
    }

    const handleDismiss = () => {
      this.setState({ messageVisible: false })
    }

    return (
      <div className='settingsComponent'>
        { messageVisible?
            connected?
              <div>
                <Message
                  onDismiss={handleDismiss}
                  success
                  header='You have successfully connected your Wallet!'
                  content='You can now view your Sharefolder and Transaction data'
                />
              </div>
              :
              <div>
                <Message
                  onDismiss={this.handleDismiss}
                  warning
                  header='You are not following any tokens'
                  content='Please search and select a token you would like to follow'
                />
              </div>
            :
            null
        }

        { !loaded ? <span>Loading settings...<Icon name='spinner' loading /></span>
          : <div>
            <Segment className='tokenComponent'>
              <Header className='title'>Followed Tokens</Header>
              <Dropdown
                selection
                search
                multiple
                className='watchingTokens'
                icon='search'
                name='watchingTokens'
                defaultValue={watchingTokens.map(token => token.address)}
                options={watchingTokenOptions}
                onChange={(e, {value}) => { this.watchingTokensValue = value.map(val => ({ address: val })) }}
                />
            </Segment>

            <Segment className='statusComponent'>
              <div className='title'>
                <div className='label'>Wallet Connection Status</div>
                <div className='status'>
                  <div className={connected ? 'connected' : 'disconnectd'}></div>
                  { connected ? 'Connected' : 'Disconnected' }
                </div>
              </div>

              <Divider />

              <div className='connectionForm'>
                <Form>
                  <Form.Field>
                    <label>Account</label>
                    <input placeholder='testing123' />
                  </Form.Field>
                  <Form.Field>
                    <label>Account Password</label>
                    <input type='password' placeholder='password' />
                  </Form.Field>
                  <div className='action'>
                    <Button type='submit' disabled={!connected} color='teal'>Edit</Button>
                  </div>
                </Form>
              </div>
              
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

            { appType === 'issuer'
              ? <Segment className='messagingComponent'>
                  <div className='title'>Messaging Account ID</div>
                  <div className='messagingForm'>
                    <Form>
                      <Form.Field>
                        <Input id='messaging-account-input' name='messaging-acount' defaultValue={currentUser.messagingAddress} />
                      </Form.Field>
                      <div className='action'>
                        <Button color='teal' disabled={!connected} onClick={handleSetMessagingAccount}>Edit</Button>
                      </div>
                    </Form>
                  </div>
              </Segment>
            : '' }
          </div>
        }
      </div>
    )
  }
}

export default SettingsView

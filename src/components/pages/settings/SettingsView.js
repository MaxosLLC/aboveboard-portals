import React, { Component } from 'react'
import { differenceBy } from 'lodash'
import { Divider, Dropdown, Header, Icon, Segment, Form, Message, Container } from 'semantic-ui-react'
import Button from '../../inputs/button/Button'
import './Settings.css'

class SettingsView extends Component {
  constructor (props) {
    super(props)
    const { currentUser } = this.props

    this.state = {
      messageVisible: true,
      account: currentUser.walletAccountName || '',
      password: '',
      messagingAddress: currentUser.messagingAddress,
      formErrors: {
        account: false,
        password: false,
        messagingAddress: false
      }
    }
  }

  render () {
    const { messageVisible, account, password, messagingAddress, formErrors } = this.state
    const { loaded, appType, connected, connectWallet, tokens, watchingTokens, startWatchingToken, stopWatchingToken, setMessagingAddress } = this.props

    const watchingTokenOptions = tokens.map(token => {
      return {
        text: token.name,
        value: token.address,
      };
    });

    const handleConnectWallet = () => {
      if (!account) {
        this.setState({
          formErrors: {
            ...formErrors,
            account: true
          }
        })
        return
      }

      if (!password) {
        this.setState({
          formErrors: {
            ...formErrors,
            password: true
          }
        })
      }

      return connectWallet(account, password);
    };

    const handleSetMessagingAccount = () => {
      if (!messagingAddress) {
        this.setState({
          formErrors: {
            ...formErrors,
            messagingAddress: true
          }
        })
        return
      }

      setMessagingAddress(messagingAddress, watchingTokens)
    }

    const handleDismiss = () => {
      this.setState({ messageVisible: false })
    }

    const handleChange = (e, { name, value }) => {
      if (!value) {
        this.setState({
          formErrors: {
            ...formErrors,
            [name]: true
          }
        })
      } else {
        this.setState({
          formErrors: {
            ...formErrors,
            [name]: false
          }
        })
      }

      this.setState({ [name]: value })
    }

    const handleChangeWatchingTokens = (e, { value }) => {
      this.watchingTokensValue = value.map(val => ({ address: val }))
      const addedTokens = differenceBy(this.watchingTokensValue, watchingTokens, 'address')
      const removedTokens = differenceBy(watchingTokens, this.watchingTokensValue, 'address')

      addedTokens.forEach(startWatchingToken)
      removedTokens.forEach(stopWatchingToken)
    }

    return (
      <Container className='settingsComponent'>
        { messageVisible?
            connected?
              <div className='headerAlert'>
                <Message
                  onDismiss={handleDismiss}
                  success
                  header='You have successfully connected your Wallet!'
                  content='You can now view your Sharefolder and Transaction data'
                />
              </div>
              : <div>
                <Message
                  onDismiss={this.handleDismiss}
                  warning
                  header='You are not following any tokens'
                  content='Please search and select a token you would like to follow'
                />
              </div>
            : null
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
                onChange={handleChangeWatchingTokens}
                />
            </Segment>

            <Segment className='statusComponent'>
              <div className='title'>
                <div className='label'>Wallet Connection Status</div>
                <div className='status'>
                  <div className={connected ? 'connected' : 'disconnectd'} />
                  { connected ? 'Connected' : 'Disconnected' }
                </div>
              </div>

              <Divider />

              <div className='connectionForm'>
                <Form className={(formErrors['account'] || formErrors['password']) ? 'warning' : ''} onSubmit={handleConnectWallet}>
                  <Form.Field>
                    <Form.Input error={formErrors['account']} label='Account' className='input-wrapper' placeholder='testing123' name='account' value={account} onChange={handleChange} autoComplete='new-password' />
                    {formErrors['account']
                      ? <div className='message-wrapper'>
                        <Message
                          warning
                          header='Empty Field!'
                          content='Account field is required.'
                        />
                      </div>
                      : ''
                    }
                  </Form.Field>
                  <Form.Field>
                    <Form.Input error={formErrors['password']} label='Account Password' className='input-wrapper' type='password' placeholder='password' name='password' value={password} onChange={handleChange} autoComplete='new-password' />
                    {formErrors['password']
                      ? <div className='message-wrapper'>
                        <Message
                          warning
                          header='Empty Field!'
                          content='Account password field is required.'
                        />
                      </div>
                      : ''
                    }
                  </Form.Field>
                  <div className='action'>
                    <Button type='submit' disabled={!connected} color='teal'>Edit</Button>
                  </div>
                </Form>
              </div>
            </Segment>

            { appType === 'issuer'
              ? <Segment className='messagingComponent'>
                <div className='form-wrapper'>
                  <div className='title'>Messaging Account ID</div>
                  <div className='messagingForm'>
                    <Form className={formErrors['messagingAddress'] ? 'warning' : ''} onSubmit={handleSetMessagingAccount}>
                      <Form.Field>
                        <Form.Input error={formErrors['messagingAddress']} name='messagingAddress' placeholder='^[Ada{}}sdS//s?]$' value={messagingAddress} onChange={handleChange} />
                      </Form.Field>
                      <div className='action'>
                        <Button color='teal' disabled={!connected}>Edit</Button>
                      </div>
                    </Form>
                  </div>
                </div>

                {formErrors['messagingAddress']
                    ? <div className='message-wrapper'>
                      <Message
                        warning
                        header='Empty Field!'
                        content='Messaging Address field is required.'
                      />
                    </div>
                    : ''
                  }
              </Segment>
            : '' }
          </div>
        }
      </Container>
    )
  }
}

export default SettingsView;

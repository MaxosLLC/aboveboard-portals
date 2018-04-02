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
      account: currentUser.walletAccountName || '',
      password: '',
      messagingAddress: currentUser.messagingAddress,
      formErrors: {
        account: !currentUser.walletAccountName,
        password: true,
        messagingAddress: !currentUser.messagingAddress
      }
    }
  }

  componentWillUnmount () {
    this.props.dismissConnectionMessage()
  }

  render () {
    const { account, password, messagingAddress, formErrors } = this.state
    const { loaded, appType, connected, connectWallet, tokens, watchingTokens, startWatchingToken,
      stopWatchingToken, setMessagingAddress, showConnectionAlert } = this.props

    const watchingTokenOptions = tokens.map(token => {
      return {
        text: token.name,
        value: token.address
      }
    })

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

      return connectWallet(account, password)
    }

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
      this.props.dismissConnectionMessage()
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
        { loaded && showConnectionAlert && connected
          ? <div className='headerAlert'>
            <Message
              onDismiss={handleDismiss}
              success
              header='You have successfully connected your Wallet!'
              content='You can now view your Shareholder and Transaction data'
            />
          </div>
          : ''
        }
        { loaded && showConnectionAlert && (!watchingTokens || (watchingTokens && watchingTokens.length === 0))
          ? <div className='headerAlert'>
            <Message
              onDismiss={handleDismiss}
              warning
              header='You are not following any tokens'
              content='Please search and select a token you would like to follow'
            />
          </div>
          : null
        }
        <div>
          <Segment>
            { !loaded ? <span>Loading settings...<Icon name='spinner' loading /></span>
              : <div className='tokenComponent'><Header className='title'>Followed Tokens</Header>
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
              </div>
            }
          </Segment>

          <Segment className='statusComponent'>
            <div className='title'>
              <div className='label'>Wallet Connection Status</div>
              <div className='status'>
                <div className={connected ? 'connected' : 'disconnected'} />
                { connected ? 'Connected' : 'Disconnected' }
              </div>
            </div>

            <Divider />

            <div className='connectionForm'>
              <Form onSubmit={handleConnectWallet}>
                <Form.Field>
                  <Form.Input label='Account' className='input-wrapper' placeholder='testing123' name='account' value={account} autoComplete='new-password' onChange={handleChange} />
                </Form.Field>
                <Form.Field>
                  <Form.Input label='Account Password' className='input-wrapper' type='password' placeholder='password' name='password' value={password} autoComplete='new-password' onChange={handleChange} />
                </Form.Field>
                <div className='action'>
                  { connected
                    ? <Button type='submit' color='teal'>Edit</Button>
                    : <Button type='submit' color={(!formErrors['account'] && !formErrors['password']) ? 'teal' : 'gray'} disabled={formErrors['account'] || formErrors['password']}>Connect</Button>
                  }
                </div>
              </Form>
            </div>
          </Segment>

          { appType === 'issuer'
            ? <Segment className='messagingComponent'>
              <div className='form-wrapper'>
                <div className='messagingForm'>
                  <Form onSubmit={handleSetMessagingAccount}>
                    <Form.Field>
                      <div className='title'>Messaging Account ID</div>
                      <Form.Input name='messagingAddress' placeholder='^[Ada{}}sdS//s?]$' value={messagingAddress} onChange={handleChange} />
                    </Form.Field>
                    <div className='action'>
                      { connected
                        ? <Button type='submit' color='teal'>Edit</Button>
                        : <Button type='submit' color={!formErrors['messagingAddress'] ? 'teal' : 'gray'} disabled={formErrors['messagingAddress']}>Save</Button>
                      }
                    </div>
                  </Form>
                </div>
              </div>
            </Segment>
          : '' }
        </div>
      </Container>
    )
  }
}

export default SettingsView

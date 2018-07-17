import React, {Component} from 'react'
import {differenceBy} from 'lodash'
import { Button, Divider, Dropdown, Header, Icon, Input, Segment, Message } from 'semantic-ui-react'
import './Settings.css'

class SettingsView extends Component {
  componentWillMount () {
    this.setState({
      walletEditMode: false,
      messagingIdEditMode: false,
      accountName: this.props.currentUser.walletAccountName || '',
      accountPass: '',
      messagingId: this.props.currentUser.messagingAddress || '',
      hideErrorMessage: false,
      hideWarningMessage: false,
      hideSuccessMessage: true
    })
  }
  noTokensMessage (tokens) {
    if (!tokens.length) {
      return (<Message
        warning
        header='You are not following any tokens'
        content='Please search and select a token you would like to follow' />)
    }
  }
  walletErrorMessage (error) {
    if (!this.state.hideErrorMessage) {
      if (error) {
        return (<Message
          negative
          onDismiss={() => this.hideErrorMessage(true)}
          header='Failed connection atempt'
          content='Please make sure you have enetered the right account name and password for your wallet' />)
      }
    }
  }
  walletSuccessMessage (connection) {
    if (!this.state.hideSuccessMessage) {
      if (connection) {
        return (<Message
          success
          onDismiss={() => this.hideSuccessMessage(true)}
          header='You have successfully connected your Wallet!'
          content='You can now view your Shareholder and Transaction data' />)
      }
    }
  }

  hideErrorMessage (bool) {
    this.setState({hideErrorMessage: bool})
  }
  hideWarningMessage (bool) {
    this.setState({hideWarningMessage: bool})
  }
  hideSuccessMessage (bool) {
    this.setState({hideSuccessMessage: bool})
  }
  setAccountToTarget (e) {
    this.setState({accountName: e.target.value})
  }
  setPassToTarget (e) {
    this.setState({accountPass: e.target.value})
  }
  setMessagingIdToTarget (e) {
    this.setState({messagingId: e.target.value})
  }
  messgingAddressEdit (bool) {
    this.setState({messagingIdEditMode: bool})
  }
  walletEdit (bool) {
    this.setState({walletEditMode: bool})
  }
  render () {
    const {
      role,
      loaded,
      connected,
      connectWallet,
      currentUser,
      currentToken,
      tokens,
      watchingTokens,
      startWatchingToken,
      stopWatchingToken,
      setMessagingAddress,
      error
    } = this.props
    const account = document.getElementById('wallet-account-input')
    const password = document.getElementById('wallet-password-input')
    const messagingAddress = document.getElementById('messaging-account-input')
    const watchingTokenOptions = tokens.map(token => {
      return { text: token.name, value: token.address }
    })

    const handleConnectWallet = () => {
      if (!account.value) {
        return alert('Please enter account address') // eslint-disable-line
      }
      if (!password.value) {
        return alert('Please enter your account password') // eslint-disable-line
      }

      connectWallet(account.value, password.value)
        .then(res => {
          if (res) {
            this.hideSuccessMessage(false)
          } else {
            this.hideErrorMessage(false)
            this.hideSuccessMessage(true)
          }
        })
    }

    const handleChangeWatchingTokens = () => {
      const addedTokens = differenceBy(this.watchingTokensValue, watchingTokens, 'address')
      const removedTokens = differenceBy(watchingTokens, this.watchingTokensValue, 'address')
      addedTokens.forEach(startWatchingToken)
      removedTokens.forEach(stopWatchingToken(currentToken))
    }

    const handleSetMessagingAccount = () => {
      if (!messagingAddress.value) {
        return alert('Please enter a messaging address') // eslint-disable-line
      }

      setMessagingAddress(currentUser, messagingAddress.value, watchingTokens)

      this.setState({ messagingIdEditMode: false })
    }

    return (
      <div className='settingsComponent'>
        {role !== 'buyer' && this.noTokensMessage(watchingTokens)}
        {this.walletErrorMessage(error)}
        {this.walletSuccessMessage(connected)}
        { role !== 'buyer' &&
          <Segment>
            <div
              className='inputContainer'
              style={{
                justifyContent: 'space-between'
              }}>
              <Header
                as='h4'
                className='settingHeader'
                style={{
                  marginBottom: 0
                }}>Followed Tokens</Header>
              { loaded ? <Dropdown
                selection
                search
                multiple
                name='watchingTokens'
                defaultValue={watchingTokens.map(token => token.address)}
                options={watchingTokenOptions}
                onChange={(e, { value }) => {
                  this.watchingTokensValue = value.map(address => ({ address }))
                  handleChangeWatchingTokens()
                }}
                icon='search'
                className='settingInput'
                style={{
                  width: '84%',
                  marginLeft: 0
                }} /> : <span>Loading available tokens...<Icon name='spinner' loading /></span> }
            </div>
          </Segment>
        }

        <Segment>
          <Header as='h4' className='settingHeader' style={{marginTop: '20px'}}>Wallet Connection Status
            <span className='connectionIndicator'>
              <span
                className={connected
                ? 'connected'
                : 'disconnected'} />
              {connected
                ? 'Connected'
                : 'Disconnected'}
            </span>
          </Header>
          <div>
            <Divider />
            <div className='inputContainer'>
              <label>Account</label>
              <Input
                id='wallet-account-input'
                name='wallet-account'
                defaultValue={this.state.accountName}
                className='settingInput'
                disabled={!this.state.walletEditMode}
                onChange={(e) => this.setAccountToTarget(e)} />
            </div>

            <div className='inputContainer'>
              <label>Password</label>
              <Input
                id='wallet-password-input'
                name='wallet-password'
                type='password'
                defaultValue={this.state.accountPass}
                className='settingInput'
                disabled={!this.state.walletEditMode}
                onChange={(e) => this.setPassToTarget(e)} />
            </div>
            <div className='buttonContainer'>
              <Button
                style={{
                  background: 'none'
                }}
                className={this.state.walletEditMode
                ? ''
                : 'hide'}
                onClick={() => {
                  if (!connected) {
                    account.value = ''
                    password.value = ''
                  } else {
                    account.value = currentUser.walletAccountName
                    password.value = ''
                  }
                  return this.walletEdit(false)
                }}>Cancel</Button>
              {this.state.walletEditMode
                ? <Button
                  color={!this.state.accountName.length || !this.state.accountPass.length
                    ? 'grey'
                    : 'teal'}
                  onClick={handleConnectWallet}
                  disabled={!this.state.accountName.length || !this.state.accountPass.length}>Save</Button>
                : <Button color='teal' onClick={() => this.walletEdit(true)}>Edit</Button>
              }
            </div>
          </div>
        </Segment>

        <Segment>
          <div
            className='inputContainer'
            style={{
              justifyContent: 'space-between'
            }}>
            <Header
              as='h4'
              className='settingHeader'
              style={{
                marginBottom: 0
              }}>Messaging Account ID</Header>
            <Input
              id='messaging-account-input'
              name='messaging-acount'
              defaultValue={this.state.messagingId}
              className='settingInput'
              style={{
                width: '79%',
                marginLeft: 0
              }}
              disabled={!this.state.messagingIdEditMode}
              onChange={(e) => this.setMessagingIdToTarget(e)} />
          </div>
          <div className='buttonContainer'>
            <Button
              style={{
                background: 'none'
              }}
              className={this.state.messagingIdEditMode
                ? ''
                : 'hide'}
              onClick={() => this.messgingAddressEdit(false)}>Cancel</Button>
            {this.state.messagingIdEditMode
                ? <Button
                  color={!this.state.messagingId.length
                        ? 'grey'
                        : 'teal'}
                  onClick={handleSetMessagingAccount}
                  disabled={!this.state.messagingId.length}>Save</Button>
                : <Button color='teal' onClick={() => this.messgingAddressEdit(true)}>Edit</Button>
                }
          </div>
        </Segment>
      </div>
    )
  }
}

export default SettingsView

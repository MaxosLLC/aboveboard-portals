import React, { Component } from 'react'
import { differenceBy } from 'lodash'
import { Button, Divider, Dropdown, Header, Icon, Input, Label, Segment, Message } from 'semantic-ui-react'
import './Settings.css'

class SettingsView extends Component {
  noTokensMessage = (tokens) => {
    if(tokens.length < 1){
      return (
         <Message
          warning
          header='You are not following any tokens'
          content='Please search and select a token you would like to follow'
        />
      )
    }
  }
  render () {
    const {
            appType, 
            connected, 
            connectWallet, 
            currentUser, 
            tokens, 
            watchingTokens, 
            startWatchingToken, 
            stopWatchingToken, 
            setMessagingAddress
           } = this.props

    const watchingTokenOptions = tokens.map(token => {
      return {
        text: token.name,
        value: token.address
      }
    })
    console.log(this.props)
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

    const handleSetMessagingAccount = () => {
      const messagingAddress = document.getElementById('messaging-account-input').value

      if (!messagingAddress) {
        return alert('Please enter a messaging address') // eslint-disable-line
      }

      setMessagingAddress(messagingAddress, watchingTokens)
    }

    return (
      <div className='settingsComponent'>
        {this.noTokensMessage(watchingTokens)}
        <Segment>
         <div className="inputContainer" style={{justifyContent: 'space-between'}}>
          <Header as='h4' className="settingHeader" style={{marginBottom: 0}}>Followed Tokens</Header>
          <Dropdown
            selection
            search
            multiple
            name='watchingTokens'
            defaultValue={watchingTokens.map(token => token.address)}
            options={watchingTokenOptions}
            onChange={(e, {value}) => { 
              this.watchingTokensValue = value.map(val => ({ address: val })) 
              handleChangeWatchingTokens()
              }}
            icon="search"
            className="settingInput"
            style={{width: '84%', marginLeft: 0}}
            />
         </div>
        </Segment>

        <Segment>
          <Header as='h4' className="settingHeader">Wallet Connection Status
            <span className="connectionIndicator">
              <span className={connected ? 'connected' : 'disconnected'}></span>
              {connected ? 'Connected' : 'Disconnected'}
            </span>
          </Header> 
            <div>
            <Divider />
            <div className="inputContainer">
              <label>Account</label>
              <Input 
                id='wallet-account-input' 
                name='wallet-account' 
                defaultValue={connected ? currentUser.walletAccountName : '' }
                className="settingInput"
              />
            </div>
           
            <div  className="inputContainer">
              <label>Password</label>
              <Input 
                id='wallet-password-input' 
                name='wallet-password' 
                type='password' 
                defaultValue={connected ? "password" : '' }
                className="settingInput"
                />
            </div>
            <div className="buttonContainer">
              <Button>Cancel</Button>
              <Button  color="teal" onClick={handleConnectWallet}>{connected?'Disconnect':'Connect'}</Button>
            </div>
          </div>
        </Segment>

        { appType === 'issuer'
          ? <Segment>
            <div className="inputContainer"  style={{justifyContent: 'space-between'}}>
              <Header as='h4' className="settingHeader" style={{marginBottom: 0}}>Messaging Account ID</Header> 
              <Input
                id='messaging-account-input' 
                name='messaging-acount' 
                defaultValue={currentUser.messagingAddress}
                className="settingInput"
                style={{width: '79%', marginLeft: 0}}
                />
            </div>
           <div className="buttonContainer">
              <Button>Cancel</Button>
              <Button  color="teal" onClick={handleSetMessagingAccount}>{connected?'Edit':'Save'}</Button>
           </div>
          </Segment>
        : '' }
      </div>

    )
  }
}

export default SettingsView

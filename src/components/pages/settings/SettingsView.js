import React, { Component } from 'react'
import { differenceBy } from 'lodash'
import { Button, Divider, Dropdown, Header, Input, Segment, Message } from 'semantic-ui-react'
import './Settings.css'

class SettingsView extends Component {
  componentWillMount = () => {
    this.setState({
      walletEditMode: false,
      messagingIdEditMode: false,
      accountName: this.props.currentUser.walletAccountName,
      accountPass: '',
      messagingId: this.props.currentUser.messagingAddress,
      errorMessage: this.props.error,
      errorMessagingAddress: this.props.error,
      warningMessageHidden: false
    })
  }
  noTokensMessage = (tokens) => {
    if(tokens.length < 1){
      return (
         <Message
          warning
          hidden={this.state.warningMessageHidden}
          onDismiss={() => this.setState({ warningMessageHidden: true })}
          header='You are not following any tokens'
          content='Please search and select a token you would like to follow'
        />
      )
    }
  }
  walletErrorMessage = (error) => {
    if(error){
      return (
         <Message
          negative
          hidden={this.state.errorMessage}
          onDismiss={() => this.setState({errorMessage: true})}
          header='Failed connection atempt'
          content='Please make sure you have enetered the right account name and password for your wallet'
        />
      )
    }
  }


  render () {
    const { appType, 
            connected, 
            connectWallet, 
            tokens, 
            watchingTokens, 
            startWatchingToken, 
            stopWatchingToken, 
            setMessagingAddress,
            error
           } = this.props
           console.log(this.props)
    const account = document.getElementById('wallet-account-input')
    const password = document.getElementById('wallet-password-input')
    const messagingAddress = document.getElementById('messaging-account-input')
    const watchingTokenOptions = tokens.map(token => {
      return {
        text: token.name,
        value: token.address
      }
    })
    
    const handleConnectWallet = () => {
      if (!account.value) {
        return alert('Please enter account address') // eslint-disable-line
      }
      if (!password.value) {
        return alert('Please enter your account password') // eslint-disable-line
      }
      this.setState({errorMessage: false})
      connectWallet(account.value, password.value)
    }

    const handleChangeWatchingTokens = () => {
        const addedTokens = differenceBy(this.watchingTokensValue, watchingTokens, 'address')
        const removedTokens = differenceBy(watchingTokens, this.watchingTokensValue, 'address')
        addedTokens.forEach(startWatchingToken)
        removedTokens.forEach(stopWatchingToken)
    }

    const handleSetMessagingAccount = () => {
      if (!messagingAddress.value) {
        return alert('Please enter a messaging address') // eslint-disable-line
      }
      // this throws a big number ops error everytime
      setMessagingAddress(messagingAddress.value, watchingTokens)
      .then()
      .catch(err => {
        console.log(err)
      })
    }

    return (
      <div className='settingsComponent'>
        {this.noTokensMessage(watchingTokens)}
        {this.walletErrorMessage(error)}
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
                defaultValue={this.state.accountName}
                className="settingInput"
                disabled={!this.state.walletEditMode}
                onChange={(e) => this.setState({accountName: e.target.value})}
              />
            </div>
           
            <div className="inputContainer">
              <label>Password</label>
              <Input 
                id='wallet-password-input' 
                name='wallet-password' 
                type='password'
                defaultValue={this.state.accountPass}
                className="settingInput"
                disabled={!this.state.walletEditMode}
                onChange={(e) => this.setState({accountPass: e.target.value}) }
                />
            </div>
            <div className="buttonContainer">
              <Button 
              style={{background: 'none'}} 
              className={this.state.walletEditMode ? '': 'hide'}
              onClick={() => {
                if(!connected){
                  account.value = ''
                  password.value = ''
                }
                return this.setState({walletEditMode: false})
              } }>Done</Button>
              {this.state.walletEditMode 
                ?<Button  
                    color={!this.state.accountName.length || !this.state.accountPass.length ? 'grey': 'teal'} 
                    onClick={handleConnectWallet}
                    disabled={!this.state.accountName.length || !this.state.accountPass.length}
                  >Connect</Button>
                :<Button  
                    color="teal"
                    onClick={() => this.setState({walletEditMode: true})}
                  >Edit</Button> 
              }
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
                defaultValue={this.state.messagingId}
                className="settingInput"
                style={{width: '79%', marginLeft: 0}}
                disabled={!this.state.messagingIdEditMode}
                onChange={(e) => this.setState({messagingId: e.target.value}) }
                />
            </div>
           <div className="buttonContainer">
              <Button 
              style={{background: 'none'}} 
              className={this.state.messagingIdEditMode ?'': 'hide'}
              onClick={() => this.setState({ messagingIdEditMode: false })}>Done</Button>
              {this.state.messagingIdEditMode
               ? <Button 
                  color={!this.state.messagingId.length ? 'grey':'teal'} 
                  onClick={handleSetMessagingAccount}   // TODO: needs fix for ops error on setMessagingAddress
                  disabled={!this.state.messagingId.length}>Save</Button>
                : <Button
                color="teal"
                onClick={() => this.setState({messagingIdEditMode: true})}
                >Edit</Button>
              }
           </div>
          </Segment>
        : '' }
      </div>

    )
  }
}

export default SettingsView

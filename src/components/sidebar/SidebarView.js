import React, { Component } from 'react'
import { Icon, Label, Menu } from 'semantic-ui-react'
import './Sidebar.css'

const buyersRegexp = /^\/buyer/
// { appType === 'broker' ? <Menu.Item name='whitelists' onClick={() => routeTo('/whitelists')} active={whitelistsRegexp.test(router.location.pathname)}><Icon name='archive' />Whitelists</Menu.Item> : '' } const whitelistsRegexp = /^\/whitelist/
const tokensRegexp = /^\/token\/[a-zA-Z0-9-]+\/detail$/

class SidebarView extends Component {
  render () {
    const { appType, connected, currentUser, routeTo, router } = this.props

    return currentUser.id || currentUser._id ? (
      <Menu inverted vertical fixed='left' className='sidebarComponent' style={{ backgroundColor: '#03a0cc' }}>
        { appType === 'broker' ? <Menu.Item name='buyers' onClick={() => routeTo('/buyers')} active={buyersRegexp.test(router.location.pathname)}><Icon name='dollar' />Buyers</Menu.Item> : '' }
        { appType === 'issuer' ? <Menu.Item name='tokens' onClick={() => routeTo('/tokens')} active={tokensRegexp.test(router.location.pathname)}><Icon name='archive' />Tokens</Menu.Item> : '' }
        <Menu.Item>Wallet <Label color={connected ? 'green' : 'red'}>{ connected ? 'Connected' : 'Disconnected' }</Label></Menu.Item>
      </Menu>
    ) : ''
  }
}

export default SidebarView

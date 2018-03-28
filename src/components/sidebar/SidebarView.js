import React, { Component } from 'react'
import { Icon, Label, Menu } from 'semantic-ui-react'
import './Sidebar.css'

const buyersRegexp = /^\/buyer/
// { appType === 'broker' ? <Menu.Item name='whitelists' onClick={() => routeTo('/whitelists')} active={whitelistsRegexp.test(router.location.pathname)}><Icon name='archive' />Whitelists</Menu.Item> : '' } const whitelistsRegexp = /^\/whitelist/
const tokensRegexp = /^\/tokens\/[a-zA-Z0-9-]+\/detail$/

class SidebarView extends Component {
  render () {
    const { appType, connected, currentUser, routeTo, router } = this.props

    return currentUser.id || currentUser._id ? (
      <Menu inverted vertical fixed='left' className='sidebarComponent' style={{ backgroundColor: '#03a0cc', paddingTop: '60px' }}>
        { appType === 'broker' ? <Menu.Item name='buyers' onClick={() => routeTo('/buyers')} active={buyersRegexp.test(router.location.pathname)}><Icon name='dollar' />Buyers</Menu.Item> : '' }
        { appType === 'issuer' ? <Menu.Item name='tokens' onClick={() => routeTo('/tokens')} ><Icon name='archive' />Securities</Menu.Item> : '' }
        <Menu.Item active={tokensRegexp.test(router.location.pathname)}> Dashboard </Menu.Item>
        <Menu.Item >Wallet <Icon name='circle' color={ connected ? 'green' : 'red' }/></Menu.Item>
      </Menu>
    ) : ''
  }
}

export default SidebarView

import React, { Component } from 'react'
import { Menu, Image } from 'semantic-ui-react'
import { connect } from 'react-redux'

import './Sidebar.css'

const walletSrc = '/images/icons/wallet.svg'
const dollarSignSrc = '/images/icons/dollarSign.svg'
const sortArrowsSrc = '/images/icons/sortArrows.svg'
const barsSrc = '/images/icons/bars.svg'
const logoSrc = '/images/logo.png'

const buyersRegexp = /^\/buyer/
const tokensRegexp = /^\/tokens$/
const tokenDetailRegexp = /^\/tokens\/[\d||\w]+\/detail$/

class SidebarView extends Component {
  render () {
    const { appType, connected, currentUser, routeTo, router } = this.props
    return currentUser.id || currentUser._id ? (
      <Menu inverted vertical className='sidebarComponent'>
        <Menu.Item onClick={() => routeTo('/')} className='logoContainer'>
          <Image src={logoSrc} className='siteLogo' />
        </Menu.Item>
          <div className='updatesAvailable' onClick={() => { window.alert('aaa')}}>
            Updates Available
          </div>
        { appType === 'broker' || appType === 'direct'
          ? <Menu.Item name='buyers' onClick={() => routeTo('/buyers')} active={buyersRegexp.test(router.location.pathname)} className='sidebarMenuItem'>
            <span><Image src={dollarSignSrc} className='menuIcon' />Buyers</span><Image src={sortArrowsSrc} className='menuIcon-sm' />
          </Menu.Item>
        : null }
        { appType === 'issuer' || appType === 'direct'
          ? <Menu.Item name='tokens' onClick={() => routeTo('/tokens')} active={tokensRegexp.test(router.location.pathname)} className='sidebarMenuItem'>
            <span><Image src={dollarSignSrc} className='menuIcon' />Securities</span><Image src={sortArrowsSrc} className='menuIcon-sm' />
          </Menu.Item>
        : null }
        <Menu.Item active={tokenDetailRegexp.test(router.location.pathname)} className='sidebarMenuItem'>
          <span><Image src={barsSrc} className='menuIcon' />Dashboard</span>
        </Menu.Item>
        <Menu.Item className='sidebarMenuItem'>
          <span><Image src={walletSrc} className='menuIcon' />Wallet</span>
          <span className={connected ? 'connected' : 'disconnected'} />
        </Menu.Item>
      </Menu>
    ) : ''
  }
}

const mapStateToProps = state => ({
  currentUser: state.currentUser
})

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarView)

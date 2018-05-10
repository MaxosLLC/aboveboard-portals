import React, { Component } from 'react'
import { Menu, Image } from 'semantic-ui-react'
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

    const MenuItem = Menu.Item

    return currentUser.id || currentUser._id ? (
      <Menu inverted vertical className='sidebarComponent'>
        <MenuItem onClick={() => routeTo('/')} className='logoContainer'>
          <Image src={logoSrc} className='siteLogo' />
        </MenuItem>
        { appType === 'broker' || appType === 'direct'
          ? <MenuItem name='buyers' onClick={() => routeTo('/buyers')} active={buyersRegexp.test(router.location.pathname)} className='sidebarMenuItem'>
            <span><Image src={dollarSignSrc} className='menuIcon' />Buyers</span><Image src={sortArrowsSrc} className='menuIcon-sm' />
          </MenuItem>
        : null }
        { appType === 'issuer' || appType === 'direct'
          ? <MenuItem name='tokens' onClick={() => routeTo('/tokens')} active={tokensRegexp.test(router.location.pathname)} className='sidebarMenuItem'>
            <span><Image src={dollarSignSrc} className='menuIcon' />Securities</span><Image src={sortArrowsSrc} className='menuIcon-sm' />
          </MenuItem>
        : null }
        <MenuItem active={tokenDetailRegexp.test(router.location.pathname)} className='sidebarMenuItem'>
          <span><Image src={barsSrc} className='menuIcon' />Dashboard</span>
        </MenuItem>
        <MenuItem className='sidebarMenuItem'>
          <span><Image src={walletSrc} className='menuIcon' />Wallet</span>
          <span className={connected ? 'connected' : 'disconnected'} />
        </MenuItem>
      </Menu>
    ) : ''
  }
}

export default SidebarView

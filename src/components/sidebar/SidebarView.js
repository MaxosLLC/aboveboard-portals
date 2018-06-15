import React, { Component } from 'react'
import { Menu, Image } from 'semantic-ui-react'
import './Sidebar.css'

// const { REACT_APP_VERSION } = window
const MenuItem = Menu.Item

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
    const { connected, currentUser, currentToken, routeTo, router } = this.props

    const MenuItem = Menu.Item

    return currentUser.id || currentUser._id ? (
      <Menu inverted vertical className='sidebarComponent'>
        <MenuItem onClick={() => routeTo('/')} className='logoContainer'>
          <Image src={logoSrc} className='siteLogo' />
          { /* <p className='version'>{ REACT_APP_VERSION || '1.0.0' }</p> */ }
        </MenuItem>
        { currentUser.role === 'broker' || currentUser.role === 'direct'
          ? <MenuItem name='buyers' onClick={() => routeTo('/buyers')} active={buyersRegexp.test(router.location.pathname)} className='sidebarMenuItem'>
            <span><Image src={dollarSignSrc} className='menuIcon' />Buyers</span><Image src={sortArrowsSrc} className='menuIcon-sm' />
          </MenuItem>
        : null }
        { currentUser.role === 'issuer' || currentUser.role === 'direct'
          ? <MenuItem name='tokens' onClick={() => routeTo('/tokens')} active={tokensRegexp.test(router.location.pathname)} className='sidebarMenuItem'>
            <span><Image src={dollarSignSrc} className='menuIcon' />Securities</span><Image src={sortArrowsSrc} className='menuIcon-sm' />
          </MenuItem>
        : null }
        <MenuItem
          active={tokenDetailRegexp.test(router.location.pathname)}
          className='sidebarMenuItem'
          onClick={currentToken ? () => routeTo(`/tokens/${currentToken}/detail`) : null}>
          <span><Image src={barsSrc} className='menuIcon' />Dashboard</span>
        </MenuItem>
        { currentUser.role === 'issuer' || currentUser.role === 'direct' || currentUser.role === 'broker'
          ? <MenuItem name='multisigwallets' onClick={() => routeTo('/multi-signature-wallets')} active={tokensRegexp.test(router.location.pathname)} className='sidebarMenuItem'>
            <span><Image src={dollarSignSrc} className='menuIcon' />Multisig Wallets</span><Image src={sortArrowsSrc} className='menuIcon-sm' />
          </MenuItem>
        : null }
        <MenuItem className='sidebarMenuItem'>
          <span><Image src={walletSrc} className='menuIcon' />Wallet</span>
          <span className={connected ? 'connected' : 'disconnected'} />
        </MenuItem>
      </Menu>
    ) : ''
  }
}

export default SidebarView

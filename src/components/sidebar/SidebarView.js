import React, { Component } from 'react'
import { Menu, Image } from 'semantic-ui-react'
import './Sidebar.css'

// const { REACT_APP_VERSION } = window
const MenuItem = Menu.Item

const logoSrc = '/images/logo.png'

const whitelistingRegexp = /^\/whitelisting/
const tokensRegexp = /^\/tokens$/
const tokenDetailRegexp = /^\/tokens\/[\d||\w]+\/detail$/
const multisigWalletRegpex = /^\/company-multi-signature/
const pendingTransactionsRegexp = /^\/pending-transactions/

class SidebarView extends Component {
  render () {
    const { connected, currentUser, currentToken, routeTo, router } = this.props

    return currentUser.id || currentUser._id ? (
      <Menu inverted vertical className='sidebarComponent'>
        <MenuItem onClick={() => routeTo('/')} className='logoContainer'>
          <Image src={logoSrc} className='siteLogo' />
          { /* <p className='version'>{ REACT_APP_VERSION || '1.0.0' }</p> */ }
        </MenuItem>
        { currentUser.role === 'broker' || currentUser.role === 'direct'
          ? <MenuItem name='whitelisting' onClick={() => routeTo('/whitelisting')} active={whitelistingRegexp.test(router.location.pathname)} className='sidebarMenuItem'>
            Whitelisting
          </MenuItem>
        : null }
        { currentUser.role === 'issuer' || currentUser.role === 'direct'
          ? <MenuItem name='tokens' onClick={() => routeTo('/tokens')} active={tokensRegexp.test(router.location.pathname)} className='sidebarMenuItem'>
            Securities
          </MenuItem>
        : null }
        { currentUser.role === 'issuer' || currentUser.role === 'direct'
          ? <MenuItem
          active={tokenDetailRegexp.test(router.location.pathname)}
          className='sidebarMenuItem'
          onClick={currentToken ? () => routeTo(`/tokens/${currentToken}/detail`) : null}>
          Registry
        </MenuItem>
        : null }
        { currentUser.role === 'issuer' || currentUser.role === 'direct' || currentUser.role === 'broker'
          ? <MenuItem name='multisigwallets' onClick={() => routeTo('/company-multi-signature')} active={multisigWalletRegpex.test(router.location.pathname)} className='sidebarMenuItem'>
            Company Multisig
          </MenuItem>
        : null }
        <MenuItem active={pendingTransactionsRegexp.test(router.location.pathname)} className='sidebarMenuItem' onClick={() => routeTo(`/pending-transactions`)}>
          Transactions
        </MenuItem>
        <MenuItem className='sidebarMenuItem'>
          Wallet <span className={connected ? 'connected' : 'disconnected'} />
        </MenuItem>
      </Menu>
    ) : ''
  }
}

export default SidebarView

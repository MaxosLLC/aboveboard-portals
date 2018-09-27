import React, { Component } from 'react'
import { Menu, Image } from 'semantic-ui-react'
import './Sidebar.css'

// const { REACT_APP_VERSION } = window
const { REACT_APP_BRANDING } = window
const MenuItem = Menu.Item

const logoSrc = REACT_APP_BRANDING ? `/images/logo-${REACT_APP_BRANDING}.png` : '/images/logo.png'

const distributionRegexp = /^\/distribution$/
const ownersRegexp = /^\/owners/
const whitelistsRegexp = /^\/whitelists(\/create)?$/
const tokensRegexp = /^\/securities$/
const tokenDetailRegexp = /^\/securities\/[\d||\w]+\/detail$/
const multisigWalletRegpex = /^\/governance/
const txStatusRegexp = /^\/tx-status/
const usersRegexp = /^\/users/
const walletRegexp = /^\/wallet/

class SidebarView extends Component {
  render () {
    const { connected, currentUser, currentToken, routeTo, router } = this.props

    return currentUser.id || currentUser._id ? (
      <Menu inverted vertical className='sidebarComponent'>
        <MenuItem onClick={() => routeTo('/')} className='logoContainer'>
          <Image src={logoSrc} className='siteLogo' />
          { /* <p className='version'>{ REACT_APP_VERSION || '1.0.0' }</p> */ }
        </MenuItem>
        { (currentUser.role === 'issuer' || currentUser.role === 'direct') &&
          <MenuItem name='tokens' onClick={() => routeTo('/securities')} active={tokensRegexp.test(router.location.pathname)} className='sidebarMenuItem'>
            Securities
          </MenuItem>
        }
        <MenuItem active={whitelistsRegexp.test(router.location.pathname)} className='sidebarMenuItem' onClick={() => routeTo(`/whitelists`)}>
          Whitelists
        </MenuItem>
        { (currentUser.role === 'broker' || currentUser.role === 'direct') &&
          <MenuItem name='owners' onClick={() => routeTo('/owners')} active={ownersRegexp.test(router.location.pathname)} className='sidebarMenuItem'>
            Owners
          </MenuItem>
        }
        { (currentUser.role === 'issuer' || currentUser.role === 'direct') &&
          <MenuItem
            active={tokenDetailRegexp.test(router.location.pathname)}
            className='sidebarMenuItem'
            onClick={() => routeTo(`/securities/${currentToken || 'none'}/detail`)}>
            Registry
          </MenuItem>
        }
        <MenuItem active={distributionRegexp.test(router.location.pathname)} className='sidebarMenuItem' onClick={() => routeTo(`/distribution`)}>
          Distribution
        </MenuItem>
        <MenuItem active={multisigWalletRegpex.test(router.location.pathname)} className='sidebarMenuItem' onClick={() => routeTo(`/governance`)}>
          Governance
        </MenuItem>
        { currentUser.admin &&
          <MenuItem active={usersRegexp.test(router.location.pathname)} className='sidebarMenuItem' onClick={() => routeTo(`/users`)}>
            Users
          </MenuItem>
        }
        <MenuItem active={walletRegexp.test(router.location.pathname)} className='sidebarMenuItem' onClick={() => routeTo(`/wallet`)}>
          Wallet <span className={connected ? 'connected' : 'disconnected'} />
        </MenuItem>
        { (currentUser.role === 'issuer' || currentUser.role === 'direct') &&
          <MenuItem active={txStatusRegexp.test(router.location.pathname)} className='sidebarMenuItem' onClick={() => routeTo(`/tx-status`)}>
            Tx Status
          </MenuItem>
        }
      </Menu>
    ) : ''
  }
}

export default SidebarView

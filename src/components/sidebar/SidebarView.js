import React, { Component } from 'react'
import { Menu, Image } from 'semantic-ui-react'
import './Sidebar.css'

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

    return currentUser.id || currentUser._id ? (
      <Menu inverted vertical className='sidebarComponent'>
        <MenuItem onClick={() => routeTo('/')} className='logoContainer'>
          <Image src={logoSrc} className='siteLogo' />
        </MenuItem>
        { currentUser.role === 'buyer' &&
          <MenuItem name='buyers' onClick={() => routeTo(`/buyers/your-info`)} active={buyersRegexp.test(router.location.pathname)} className='sidebarMenuItem'>
            <span><Image src={dollarSignSrc} className='menuIcon' />Your Info</span><Image src={sortArrowsSrc} className='menuIcon-sm' />
          </MenuItem>
        }
        { /(broker|direct)/.test(currentUser.role) &&
          <MenuItem name='buyers' onClick={() => routeTo('/buyers')} active={buyersRegexp.test(router.location.pathname)} className='sidebarMenuItem'>
            <span><Image src={dollarSignSrc} className='menuIcon' />Buyers</span><Image src={sortArrowsSrc} className='menuIcon-sm' />
          </MenuItem>
        }
        { /(issuer|direct)/.test(currentUser.role) &&
          <MenuItem name='tokens' onClick={() => routeTo('/tokens')} active={tokensRegexp.test(router.location.pathname)} className='sidebarMenuItem'>
            <span><Image src={dollarSignSrc} className='menuIcon' />Securities</span><Image src={sortArrowsSrc} className='menuIcon-sm' />
          </MenuItem>
        }
        <MenuItem
          active={tokenDetailRegexp.test(router.location.pathname)}
          className='sidebarMenuItem'
          onClick={currentToken ? () => routeTo(`/tokens/${currentToken}/detail`) : null}>
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

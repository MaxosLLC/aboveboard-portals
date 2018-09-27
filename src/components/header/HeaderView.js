import React, {Component} from 'react'
import { Dropdown, Divider, Image, Menu } from 'semantic-ui-react'
import './Header.css'

const DropdownItem = Dropdown.Item

const profileSrc = '/images/icons/defaultProfile.svg'

const distributionRegexp = /^\/distribution$/
const ownersRegexp = /^\/owners/
const whitelistsRegexp = /^\/whitelists(\/create)?/
const securitiesRegexp = /^\/securities$/
const tokenDetailRegexp = /^\/securities\/[a-zA-Z0-9]+\/detail$/
const txStatusRegexp = /^\/tx-status/
const usersRegexp = /^\/users/
const walletRegexp = /^\/wallet/
const companyMultiSigRegexp = /^\/governance/

const getPageDescription = path => {
  if (securitiesRegexp.test(path)) return 'Create and manage security tokens'
  if (whitelistsRegexp.test(path)) return 'Create and use private whitelists of security owners'
  if (ownersRegexp.test(path)) return 'Enter private information about security owners. Enter ethereum addresses to share on specific whitelists'
  if (usersRegexp.test(path)) return 'Add users that can login to this registry by their Google account e-mail address'
  if (txStatusRegexp.test(path)) return 'See the actions that are submitted to the Ethereum chain from this registry'
  if (distributionRegexp.test(path)) return (<span> To request distribution, please contact us at <a href='mailto:contact@aboveboard.ai'>contact@aboveboard.ai</a></span>)
  if (tokenDetailRegexp.test(path)) return 'View your security owners and transactions, comply with corporate registry rules, and provide services'
  if (walletRegexp.test(path)) return 'Log in with your MetaMask wallet'
  if (companyMultiSigRegexp.test(path)) return 'View and manage members of the company governance group'

  return ''
}

class HeaderView extends Component {
  render () {
    const { currentUser, routeTo, router, logout } = this.props
    const menuTrigger = <Image src={profileSrc} className='profileImage' />

    const path = router.location.pathname

    return currentUser.id || currentUser._id
      ? (
        <Menu className='headerComponent'>
          <Menu.Menu position='left'>
            <span style={{ color: 'black' }}>{ getPageDescription(path) }</span>
          </Menu.Menu>
          <Menu.Menu position='right'>
            <Menu.Item>{currentUser.walletAccountName}</Menu.Item>
            <Dropdown name='settings' pointing trigger={menuTrigger} icon={null}>
              <Dropdown.Menu className='headerDropdownMenu'>
                <DropdownItem key='profile' onClick={() => routeTo('/profile')}>Profile</DropdownItem>
                <DropdownItem key='settings' onClick={() => routeTo('/settings')}>Settings</DropdownItem>
                <Divider />
                <DropdownItem key='logout' onClick={logout}>Log Out</DropdownItem>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Menu>
        </Menu>
      )
      : ''
  }
}

export default HeaderView

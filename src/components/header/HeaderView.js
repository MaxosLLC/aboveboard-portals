import React, {Component} from 'react'
import { Dropdown, Divider, Image, Menu } from 'semantic-ui-react'
import Breadcrumbs from '../breadcrumbs/Breadcrumbs'
import './Header.css'

const profileSrc = '/images/icons/defaultProfile.svg'

class HeaderView extends Component {
  render () {
    const {currentUser, routeTo, logout} = this.props
    const menuTrigger = <Image src={profileSrc} className='profileImage' />
    return currentUser.id || currentUser._id
      ? (
        <Menu className='headerComponent'>
          <Breadcrumbs />
          <Menu.Menu position='right'>
            <Menu.Item>{currentUser.walletAccountName}</Menu.Item>
            <Dropdown pointing trigger={menuTrigger} icon={null}>
              <Dropdown.Menu className='headerDropdownMenu'>
                <Dropdown.Item key='profile' onClick={() => routeTo('/profile')}>Profile</Dropdown.Item>
                <Dropdown.Item key='settings' onClick={() => routeTo('/settings')}>Settings</Dropdown.Item>
                <Divider />
                <Dropdown.Item key='logout' onClick={logout}>Log Out</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Menu>
        </Menu>
      )
      : ''
  }
}

export default HeaderView

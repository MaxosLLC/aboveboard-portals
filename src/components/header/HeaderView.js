import React, {Component} from 'react'
import { Dropdown, Divider, Image, Menu } from 'semantic-ui-react'
import Breadcrumbs from '../breadcrumbs/Breadcrumbs'
import './Header.css'

const profileSrc = '/images/icons/defaultProfile.svg'

class HeaderView extends Component {
  render () {
    const {currentUser, routeTo, logout} = this.props
    const menuTrigger = <Image src={profileSrc} className='profileImage' />

    const DropdownItem = Dropdown.Item

    return currentUser.id || currentUser._id
      ? (
        <Menu className='headerComponent'>
          <Breadcrumbs />
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

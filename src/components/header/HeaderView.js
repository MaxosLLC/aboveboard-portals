import React, { Component } from 'react'
import { Dropdown, Divider, Image, Menu } from 'semantic-ui-react'
import './Header.css'

const profileSrc = './images/icons/defaultProfile.svg'

class HeaderView extends Component {
  render () {
    const { currentUser, routeTo, logout } = this.props
    const trigger = <Image src={profileSrc} />

    return currentUser.id || currentUser._id ? (
      <Menu inverted className='headerComponent'>
        <Menu.Menu position='right'>
          <Dropdown pointing trigger={trigger} icon={null}>
            <Dropdown.Menu>
              <Dropdown.Item key='profile' onClick={() => routeTo('/profile')}>Profile</Dropdown.Item>
              <Dropdown.Item key='settings' onClick={() => routeTo('/settings')}>Settings</Dropdown.Item>
              <Divider />
              <Dropdown.Item key='logout' onClick={logout}>Log Out</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      </Menu>
    ) : ''
  }
}

export default HeaderView

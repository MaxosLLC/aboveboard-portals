import React, { Component } from 'react'
import { Dropdown, Divider, Image, Menu } from 'semantic-ui-react'
import styled from 'styled-components'

import ColorRegistry from '../../assets/ColorRegistry'
import profile from '../../assets/image/profile.png'
import notification_icon from '../../assets/image/notification.png'
import search_icon from '../../assets/image/Search.png'
import './Header.css'

const UserNameLabel = styled.p`
  font-size: 14px;
  font-family: 'ProximaNova Regular';
  color: ${ColorRegistry.headColor};
`

const HeadTokenLinkLabel = styled.span`
  font-size: 16px;
  font-family: 'ProximaNova Regular';
  color: #00cddb;
  cursor: pointer;
`

const HeadCurrentLinkLabel = styled.span`
  font-size: 16px;
  font-family: 'ProximaNova Regular';
  color: ${ColorRegistry.headColor};
`

const tokensRegexp = /^\/tokens\/[a-zA-Z0-9-]+\/detail$/

class HeaderView extends Component {
  render() {
    const { currentUser, routeTo, logout, router } = this.props
    const trigger = (
      <Image
        src={profile}
        className="profileImg"
        estyle={{ height: '40px', borderRadius: '20px' }}
      />
    )

    return currentUser.id || currentUser._id ? (
      <Menu
        inverted
        className="headerComponent"
        style={{ backgroundColor: 'transparent' }}
      >
        <Menu.Menu position="left">
          <Menu.Item>
            <HeadTokenLinkLabel onClick={() => routeTo('/tokens')}>
              Securities
            </HeadTokenLinkLabel>
            {tokensRegexp.test(router.location.pathname) ? (
              <HeadCurrentLinkLabel>
                <span style={{ color: '#0cddb' }}> &nbsp;> </span>Aboveboard
                Common Stock
              </HeadCurrentLinkLabel>
            ) : null}
          </Menu.Item>
        </Menu.Menu>
        <Menu.Menu position="right" className="headerRight">
          <Menu.Item>
            <img className="searchIcon" src={search_icon} alt="searchIcon" />
          </Menu.Item>
          <Menu.Item>
            <img
              className="notificationIcon"
              src={notification_icon}
              alt="notificationIcon"
            />
          </Menu.Item>
          <Menu.Item>
            <UserNameLabel> {currentUser.walletAccountName} </UserNameLabel>
          </Menu.Item>
          <Dropdown pointing trigger={trigger} icon={null}>
            <Dropdown.Menu>
              <Dropdown.Item key="profile" onClick={() => routeTo('/profile')}>
                Profile
              </Dropdown.Item>
              <Dropdown.Item
                key="settings"
                onClick={() => routeTo('/settings')}
              >
                Settings
              </Dropdown.Item>
              <Divider />
              <Dropdown.Item key="logout" onClick={logout}>
                Log Out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      </Menu>
    ) : (
      ''
    )
  }
}

export default HeaderView
import React, {Component} from 'react'
import { Dropdown, Divider, Image, Menu, Modal, Input } from 'semantic-ui-react'
import './Header.css'

const profileSrc = './images/icons/defaultProfile.svg'
const bellSrc = './images/icons/bell.svg'
const searchSrc = './images/icons/search.svg'


class HeaderView extends Component {
  render() {
    const {currentUser, routeTo, logout} = this.props
    const menuTrigger = <Image src={profileSrc} className='profileImage'/>
    const msgTrigger = <Image src={bellSrc} className='headerIcon'/>

    // mock messages data
    let messages = [{sender: 'Broker ABC',message: 'You have some new transactions'}, {sender: 'Broker ABC',message: 'You have some new transactions'}]
    let messagesSeen = false
    
    const messagesList = messages.map(msg => (
        <Dropdown.Item>
          <p>{msg.message}</p>
          <small className="sender">From {msg.sender}</small>
        </Dropdown.Item>
      )
    )

    return currentUser.id || currentUser._id
      ? (
        <Menu className='headerComponent'>
          <Menu.Menu position='right'>
            <Menu.Item><Image src={searchSrc} className='headerIcon'/></Menu.Item>
            <Dropdown pointing trigger={msgTrigger} icon={null} className={!messagesSeen ? 'msgActive' : ''}>
                <Dropdown.Menu className="msgDropdownMenu">
                    {messagesList}
                </Dropdown.Menu>
            </Dropdown>
            <Menu.Item>{currentUser.walletAccountName}</Menu.Item>
              <Dropdown pointing trigger={menuTrigger} icon={null}>
                <Dropdown.Menu className="headerDropdownMenu">
                  <Dropdown.Item key='profile' onClick={() => routeTo('/profile')}>Profile</Dropdown.Item>
                  <Dropdown.Item key='settings' onClick={() => routeTo('/settings')}>Settings</Dropdown.Item>
                  <Divider/>
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

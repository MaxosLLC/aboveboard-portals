import React, { Component } from 'react'
import { Menu, Image, Message } from 'semantic-ui-react'
import { connect } from 'react-redux'

import './update.css'

class UpdateNotification extends Component {

  constructor(props) {
    super(props)
    this.onClickUpdate = this.onClickUpdate.bind(this)
    this.isUpdateAvailable = this.isUpdateAvailable.bind(this)
  }

  onClickUpdate() {
    this.props.update()
  }

  // Check if update is available
  isUpdateAvailable() {
    const { currentUser } = this.props
    let lastUpdated = new Date(currentUser.lastUpdated).getTime()
    let updateAvailableSince = new Date(currentUser.updateAvailableSince).getTime()

    if (isNaN(lastUpdated)) {
      lastUpdated = 0
    }

    if (isNaN(updateAvailableSince)) {
      updateAvailableSince = 0
    }
    return updateAvailableSince > lastUpdated
  }

  render () {
    const { appType, connected, currentUser, routeTo, router } = this.props
    return (<div>
      { this.isUpdateAvailable() &&
        <Message
          negative
          header='An update is available'
          content='Please click here to update!'
          onClick={this.onClickUpdate}
        />
      }
      </div>)
  }
}

const mapStateToProps = state => ({
  currentUser: state.currentUser
})

const mapDispatchToProps = dispatch => {
  return {
    update: page => dispatch({ type: 'UPDATE' })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateNotification)

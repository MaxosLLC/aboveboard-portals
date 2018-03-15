import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

class EnsureLoggedIn extends Component {
  render () {
    const { isLoggedIn, children } = this.props

    return isLoggedIn ? <div>{children}</div> : <Redirect to='/login' />
  }
}

const mapStateToProps = state => {
  return {
    isLoggedIn: state.currentUser._id
  }
}

export default connect(mapStateToProps)(EnsureLoggedIn)

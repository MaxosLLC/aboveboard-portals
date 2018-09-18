import React, { Component } from 'react'
import { Segment } from 'semantic-ui-react'

class Home extends Component {
  componentDidMount () {
    if (this.props.currentUser.role === 'broker') {
      this.props.routeTo('/owners') // TODO: remove once this page is implemented
    } else {
      this.props.routeTo('/securities') // TODO: remove once this page is implemented
    }
  }

  render () {
    return (
      <Segment>
        <span>Main Dashboard</span><br /><br />
      </Segment>
    )
  }
}

export default Home

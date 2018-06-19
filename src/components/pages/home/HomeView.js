import React, { Component } from 'react'
import { Segment } from 'semantic-ui-react'

class Home extends Component {
  componentDidMount () {
    this.props.routeTo('/tokens') // TODO: remove once this page is implemented
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

import React, { Component } from 'react'
import { Segment } from 'semantic-ui-react'

class Home extends Component {
  render () {
    return (
      <Segment>
        <span>You are logged in.</span><br /><br />
        <span>This is also the home page.</span><br /><br />
        <span>We could add some cool stuff here, like some metrics and graphics and such.</span>
      </Segment>
    )
  }
}

export default Home

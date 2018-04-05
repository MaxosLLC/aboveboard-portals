import React, { Component } from 'react'
import './StatsCard.css'

class StatsCard extends Component {
  render () {
    return this.props.stats.map(stat => (
      <div className="statsCardComponent">
          <img src={stat.icon} alt="stats"/>
          <h4>{stat.data}</h4>
          <p>{stat.title}</p>
      </div>
    ))
  }
}

export default StatsCard

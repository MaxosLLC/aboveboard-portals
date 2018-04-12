import React, { Component } from 'react'
import './StatsCard.css'

class StatsCard extends Component {
  render () {
    return this.props.stats.map((stat, i) => (
      <div className='statsCardComponent' key={`stat-${i}`}>
        <img src={stat.icon.src} alt='stats' style={{width: stat.icon.size}} />
        <div>
          <h4>{stat.data}</h4>
          <p>{stat.title}</p>
        </div>
      </div>
    ))
  }
}
export default StatsCard

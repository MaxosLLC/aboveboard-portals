import React, { Component } from 'react'
import { ConnectedRouter } from 'react-router-redux'
import { Provider } from 'react-redux'

import './app.css'

import store from 'redux/store'
import history from 'redux/history'

import Header from 'components/header/Header'
import Sidebar from 'components/sidebar/Sidebar'
import Update from 'components/update'

import Routes from './routes'

console.log('title ', window.REACT_APP_TITLE)

class App extends Component {
  render () {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <div className='appComponent'>
            <Sidebar history={history} />
            <div className='mainContainer'>
              <Header history={history} />
              <Update />
              <div className='pages'>
                <Routes />
              </div>
            </div>
          </div>
        </ConnectedRouter>
      </Provider>
    )
  }
}

export default App

import React, { Component } from 'react'
import { ConnectedRouter } from 'react-router-redux'
import { Provider } from 'react-redux'
import './app.css'

import store from 'redux/store'
import history from 'redux/history'

import Header from 'components/header/Header'
import Sidebar from 'components/sidebar/Sidebar'

import Routes from './routes'

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <div>
            <Header history={history} />
            <Sidebar history={history} />
            <div
              className="mainComponent"
              style={{ marginLeft: '250px', marginRight: '40px' }}
            >
              <Routes />
            </div>
          </div>
        </ConnectedRouter>
      </Provider>
    )
  }
}

export default App

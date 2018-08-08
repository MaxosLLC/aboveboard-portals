import React, { Component } from 'react'
import { ConnectedRouter } from 'react-router-redux'
import { Provider } from 'react-redux'

import './app.css'

import store from 'redux/store'
import history from 'redux/history'

import Header from 'components/header/Header'
import Sidebar from 'components/sidebar/Sidebar'
import Update from 'components/update'
import WalletBlocker from 'components/wallet/WalletBlocker'

import Routes from './routes'

if (/herokuapp\.com/.test(window.location.hostname)) {
  if (/broker/.test(window.location.hostname)) {
    document.title = 'Aboveboard Broker Portal Demo'
  }
  if (/issuer/.test(window.location.hostname)) {
    document.title = 'Aboveboard Issuer Registry Demo'
  }
}

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
            <WalletBlocker />
          </div>
        </ConnectedRouter>
      </Provider>
    )
  }
}

export default App

import React, { Component } from 'react'
import { ConnectedRouter } from 'react-router-redux'
import { Provider } from 'react-redux'
import styled from 'styled-components'
import './app.css'

import store from 'redux/store'
import history from 'redux/history'

import Header from 'components/header/Header'
import Sidebar from 'components/sidebar/Sidebar'

import Routes from './routes'

const MainComponent = styled.div`
  min-height: 500px;
  margin-left: 210px;
  padding-left: 120px;
  padding-right: 120px;
`

class App extends Component {
  render () {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <div>
            <Header history={history} />
            <Sidebar history={history} />
            <MainComponent>
              <Routes />
            </MainComponent>
          </div>
        </ConnectedRouter>
      </Provider>
    )
  }
}

export default App

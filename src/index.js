import React from 'react'
import ReactDOM from 'react-dom'

import './index.css'
import store from 'redux/store'
import App from './app'
import initialAuth from 'lib/initialAuth'
import cloudRealtime from 'lib/feathers/cloud/feathersRealtime'
import localRealtime from 'lib/feathers/local/feathersRealtime'

initialAuth(store)
  .then(() => ReactDOM.render(<App />, document.getElementById('root')))
  .then(cloudRealtime.init)
  .then(localRealtime.init)

import React, { Component } from 'react'
import store from 'redux/store'
import { Route, Switch } from 'react-router-dom'

import Login from 'components/pages/login/Login'
import ForgotPassword from 'components/pages/forgotPassword/ForgotPassword'
import Signup from 'components/pages/signup/Signup'
import Home from 'components/pages/home/Home'
import Tokens from 'components/pages/tokens/Tokens'
import TokenDetail from 'components/pages/tokens/detail/TokenDetail'
import Investors from 'components/pages/investors/Investors'
import InvestorDetail from 'components/pages/investors/detail/InvestorDetail'
import ShareholderDetail from 'components/pages/tokens/detail/shareholders/detail/ShareholderDetail'
import AddInvestor from 'components/pages/investors/add/AddInvestor'
import EditInvestor from 'components/pages/investors/edit/EditInvestor'
import Settings from 'components/pages/settings/Settings'
import EnsureLoggedIn from 'components/auth/EnsureLoggedIn'

class Routes extends Component {
  render () {
    const { appType } = store.getState().config

    return (
      <Switch>
        <Route exact path='/login' component={Login} />
        <Route exact path='/sign-up' component={Signup} />
        <Route exact path='/forgot-password' component={ForgotPassword} />
        <EnsureLoggedIn>
          <Route exact path='/' component={Home} />
          <Route exact path='/settings' component={Settings} />
          { appType === 'broker' || appType === 'direct' ? <Route exact path='/buyers' component={Investors} /> : '' }
          { appType === 'broker' || appType === 'direct' ? <Route exact path='/buyers/add' component={AddInvestor} /> : '' }
          { appType === 'broker' || appType === 'direct' ? <Route exact path='/buyers/:id/detail' component={InvestorDetail} /> : '' }
          { appType === 'broker' || appType === 'direct' ? <Route exact path='/buyers/:id/edit' component={EditInvestor} /> : '' }
          { appType === 'issuer' || appType === 'direct' ? <Route exact path='/tokens' component={Tokens} /> : '' }
          { appType === 'issuer' || appType === 'direct' ? <Route exact path='/tokens/:address/detail' component={TokenDetail} /> : '' }
          { appType === 'issuer' || appType === 'direct' ? <Route exact path='/tokens/:address/shareholders/:id/detail' component={ShareholderDetail} /> : '' }
        </EnsureLoggedIn>
      </Switch>
    )
  }
}

export default Routes

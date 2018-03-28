import React, { Component } from 'react';
import store from 'redux/store';
import { Route, Switch } from 'react-router-dom';

import Login from 'components/pages/login/Login';
import Home from 'components/pages/home/Home';
import Tokens from 'components/pages/tokens/Tokens';
import TokenDetail from 'components/pages/tokens/detail/TokenDetail';
import Investors from 'components/pages/investors/Investors';
import InvestorDetail from 'components/pages/investors/detail/InvestorDetail';
import ShareholderDetail from 'components/pages/tokens/detail/shareholders/detail/ShareholderDetail';
import AddInvestor from 'components/pages/investors/add/AddInvestor';
import EditInvestor from 'components/pages/investors/edit/EditInvestor';
import Settings from 'components/pages/settings/Settings';

import EnsureLoggedIn from 'components/auth/EnsureLoggedIn';

class Routes extends Component {
  render() {
    const { appType } = store.getState().config;

    return (
      <Switch>
        <Route path="/login" component={Login} />
        <EnsureLoggedIn>
          <Route exact path="/" component={Home} />
          <Route exact path="/settings" component={Settings} />
          {appType === 'broker' ? (
            <Route exact path="/buyers" component={Investors} />
          ) : (
            ''
          )}
          {appType === 'broker' ? (
            <Route exact path="/buyers/add" component={AddInvestor} />
          ) : (
            ''
          )}
          {appType === 'broker' ? (
            <Route exact path="/buyers/:id/detail" component={InvestorDetail} />
          ) : (
            ''
          )}
          {appType === 'broker' ? (
            <Route exact path="/buyers/:id/edit" component={EditInvestor} />
          ) : (
            ''
          )}
          {appType === 'issuer' ? (
            <Route exact path="/tokens" component={Tokens} />
          ) : (
            ''
          )}
          {appType === 'issuer' ? (
            <Route
              exact
              path="/tokens/:address/detail"
              component={TokenDetail}
            />
          ) : (
            ''
          )}
          {appType === 'issuer' ? (
            <Route
              exact
              path="/tokens/:address/shareholders/:id/detail"
              component={ShareholderDetail}
            />
          ) : (
            ''
          )}
        </EnsureLoggedIn>
      </Switch>
    );
  }
}

export default Routes;

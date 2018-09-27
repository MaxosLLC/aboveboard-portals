import React, { Component } from 'react'
import store from 'redux/store'
import { Route, Switch } from 'react-router-dom'

import Login from 'components/pages/login/Login'
import Home from 'components/pages/home/Home'
import Users from 'components/pages/users/Users'
import CreateUser from 'components/pages/users/create/CreateUser'
import Tokens from 'components/pages/securities/Tokens'
import TokenDetail from 'components/pages/securities/detail/TokenDetail'
import Investors from 'components/pages/investors/Investors'
import InvestorDetail from 'components/pages/investors/detail/InvestorDetail'
import ShareholderDetail from 'components/pages/securities/detail/shareholders/detail/ShareholderDetail'
import AddInvestor from 'components/pages/investors/add/AddInvestor'
import EditInvestor from 'components/pages/investors/edit/EditInvestor'
import PendingTransactions from 'components/pages/pendingTransactions/PendingTransactions'
import MultisigWallets from 'components/pages/multisigWallets/MultisigWallets'
import MultisigWalletDetail from 'components/pages/multisigWallets/detail/MultisigWalletDetail'
import Whitelists from 'components/pages/whitelists/Whitelists'
import WhitelistsAvailable from 'components/pages/whitelists/WhitelistsAvailable/WhitelistsAvailable'
import Settings from 'components/pages/settings/Settings'
import Wallet from 'components/pages/wallet/Wallet'
import EnsureLoggedIn from 'components/auth/EnsureLoggedIn'

import CreateToken from 'components/pages/securities/create/CreateToken'
import CreateWhitelist from 'components/pages/whitelists/create/CreateWhitelist'

class Routes extends Component {
  render () {
    const { admin, role } = store.getState().currentUser

    return (
      <Switch>
        <Route exact path='/login' component={Login} />
        <EnsureLoggedIn>
          <Route exact path='/' component={Home} />
          <Route exact path='/settings' component={Settings} />
          <Route exact path='/tx-status' component={PendingTransactions} />
          <Route exact path='/distribution' component={WhitelistsAvailable} />
          <Route exact path='/whitelists' component={Whitelists} />
          <Route exact path='/wallet' component={Wallet} />
          { role === 'broker' || role === 'direct' ? <Route exact path='/owners' component={Investors} /> : '' }
          { role === 'broker' || role === 'direct' ? <Route exact path='/owners/add' component={AddInvestor} /> : '' }
          { role === 'broker' || role === 'direct' ? <Route exact path='/owners/:id/detail' component={InvestorDetail} /> : '' }
          { role === 'buyer' ? <Route exact path='/owners/your-info' component={InvestorDetail} /> : '' }
          { role === 'broker' || role === 'direct' ? <Route exact path='/owners/:id/edit' component={EditInvestor} /> : '' }
          { role === 'issuer' || role === 'direct' ? <Route exact path='/securities' component={Tokens} /> : '' }
          { role === 'issuer' || role === 'direct' ? <Route exact path='/securities/:address/detail' component={TokenDetail} /> : '' }
          { role === 'issuer' || role === 'direct' ? <Route exact path='/securities/:address/shareholders/:id/detail' component={ShareholderDetail} /> : '' }
          { role === 'direct' || role === 'issuer' ? <Route exact path='/governance' component={MultisigWallets} /> : '' }
          { role === 'direct' || role === 'issuer' ? <Route exact path='/governance/:address/detail' component={MultisigWalletDetail} /> : '' }

          { role === 'direct' && <Route exact path='/securities/create' component={CreateToken} /> }
          <Route exact path='/whitelists/create' component={CreateWhitelist} />

          { admin && <Route exact path='/users' component={Users} /> }
          { admin && <Route exact path='/users/create' component={CreateUser} /> }
        </EnsureLoggedIn>
      </Switch>
    )
  }
}

export default Routes

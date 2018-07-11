import React, { Component } from 'react'
import store from 'redux/store'
import { Route, Switch } from 'react-router-dom'

import Login from 'components/pages/login/Login'
import Home from 'components/pages/home/Home'
import Tokens from 'components/pages/tokens/Tokens'
import TokenDetail from 'components/pages/tokens/detail/TokenDetail'
import Investors from 'components/pages/investors/Investors'
import InvestorDetail from 'components/pages/investors/detail/InvestorDetail'
import ShareholderDetail from 'components/pages/tokens/detail/shareholders/detail/ShareholderDetail'
import AddInvestor from 'components/pages/investors/add/AddInvestor'
import EditInvestor from 'components/pages/investors/edit/EditInvestor'
import PendingTransactions from 'components/pages/pendingTransactions/PendingTransactions'
import MultisigWallets from 'components/pages/multisigWallets/MultisigWallets'
import MultisigWalletDetail from 'components/pages/multisigWallets/detail/MultisigWalletDetail'
import Settings from 'components/pages/settings/Settings'
import EnsureLoggedIn from 'components/auth/EnsureLoggedIn'

class Routes extends Component {
  render () {
    const { role } = store.getState().currentUser

    return (
      <Switch>
        <Route exact path='/login' component={Login} />
        <EnsureLoggedIn>
          <Route exact path='/' component={Home} />
          <Route exact path='/settings' component={Settings} />
          <Route exact path='/pending-transactions' component={PendingTransactions} />
          { role === 'broker' || role === 'direct' ? <Route exact path='/whitelisting' component={Investors} /> : '' }
          { role === 'broker' || role === 'direct' ? <Route exact path='/whitelisting/add' component={AddInvestor} /> : '' }
          { role === 'broker' || role === 'direct' ? <Route exact path='/whitelisting/:id/detail' component={InvestorDetail} /> : '' }
          { role === 'buyer' ? <Route exact path='/whitelisting/your-info' component={InvestorDetail} /> : '' }
          { role === 'broker' || role === 'direct' ? <Route exact path='/whitelisting/:id/edit' component={EditInvestor} /> : '' }
          { role === 'issuer' || role === 'direct' ? <Route exact path='/tokens' component={Tokens} /> : '' }
          { role === 'issuer' || role === 'direct' ? <Route exact path='/tokens/:address/detail' component={TokenDetail} /> : '' }
          { role === 'issuer' || role === 'direct' ? <Route exact path='/tokens/:address/shareholders/:id/detail' component={ShareholderDetail} /> : '' }
          { role === 'direct' || role === 'issuer' ? <Route exact path='/company-multi-signature' component={MultisigWallets} /> : '' }
          { role === 'direct' || role === 'issuer' ? <Route exact path='/company-multi-signature/:address/detail' component={MultisigWalletDetail} /> : '' }
        </EnsureLoggedIn>
      </Switch>
    )
  }
}

export default Routes

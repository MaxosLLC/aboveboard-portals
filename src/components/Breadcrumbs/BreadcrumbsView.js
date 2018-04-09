import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './Breadcrumbs.css'

class BreadcrumbsView extends Component {
  render () {
    const { router, tokens } = this.props
    const tokenDetailRegexp = /^\/tokens\/[\d||\w]+\/detail$/
    const renderCrumbs = (path, tokens) => {
      switch(true){
        case path === '/':
           return(
              <div>
              <Link to={router.location.pathname}>Dashboard ></Link> Overview
              </div>
            )
         case path === '/tokens':
           return(
              <div>
              <Link to={router.location.pathname}>Securities ></Link>  Tokens
              </div>
            )
          case path === '/buyers':
             return(
              <div>
              <Link to={router.location.pathname}>Buyers ></Link>  Whitelist
              </div>
            )
          case path === '/settings':
            return(
              <div>
              <Link to="/profile">User ></Link>  Settings
              </div>
            )
          case path === '/profile':
            return(
              <div>
              <Link to="/profile">User ></Link>  Profile
              </div>
            )
          case tokenDetailRegexp.test(path):
            const tokenAddress = path.split('/')[path.split('/').length -2];
            const currentToken = tokens.filter(token => token.address === tokenAddress)[0];
            return(
              <div>
                <Link to="/tokens">Securities ></Link> {currentToken.name}
              </div>
            )
          default: 
            return ''
      }
    }
    return (
     <div className="breadcrumbsComponent">
         {renderCrumbs(router.location.pathname, tokens)}
     </div>
    )
  }
}

export default BreadcrumbsView

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './Breadcrumbs.css'

class BreadcrumbsView extends Component {
  render () {
    const { router, tokens } = this.props
    const tokenDetailRegexp = /^\/tokens\/[\d||\w]+\/detail$/
    const renderCrumbs = (path, tokens) => {
      // using if instead of switch to avoid unreachable code warning
      if(path === '/'){
        return(
          <div>
          <Link to={router.location.pathname}>Dashboard ></Link> Overview
          </div>
        )
      }
      if(path === '/tokens'){
        return(
          <div>
          <Link to={router.location.pathname}>Securities ></Link>  Tokens
          </div>
        )
      }
       if(path === '/buyers'){
        return(
          <div>
          <Link to={router.location.pathname}>Buyers ></Link>  Whitelist
          </div>
        )
      }
      if(path === '/settings'){
        return(
          <div>
          <Link to="/profile">User ></Link>  Settings
          </div>
        )
      }
      if(path === '/profile'){
        return(
          <div>
          <Link to="/profile">User ></Link>  Profile
          </div>
        )
      }
      if(tokenDetailRegexp.test(path)){
        const tokenAddress = path.split('/')[path.split('/').length -2];
        const currentToken = tokens.filter(token => token.address === tokenAddress)[0];
        return(
          <div>
            <Link to="/tokens">Securities ></Link> {currentToken.name}
          </div>
        )
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

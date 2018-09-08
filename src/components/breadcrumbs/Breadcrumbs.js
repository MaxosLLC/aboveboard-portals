import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import BreadcrumbsView from './BreadcrumbsView'

const mapStateToProps = state => {
  return {
    tokens: state.localToken.queryResult ? state.localToken.queryResult.data : [],
    loaded: state.localToken.isFinished,
    router: state.router
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    routeTo (path) { dispatch(push(path)) }
  }
}

const Breadcrumbs = connect(
  mapStateToProps,
  mapDispatchToProps
)(BreadcrumbsView)

export default Breadcrumbs

import { connect } from 'react-redux';
// import localServices from 'lib/feathers/local/feathersServices'
import { push } from 'react-router-redux';
import TokensView from './TokensView';

const mapStateToProps = state => ({
  tokens: state.token.queryResult ? state.token.queryResult.data : [],
  watchingTokens: state.localToken.queryResult
    ? state.localToken.queryResult.data
    : [],
  loaded: state.token.isFinished && state.localToken.isFinished,
});

const mapDispatchToProps = dispatch => {
  return {
    routeTo(path) {
      dispatch(push(path));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TokensView);

import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import localServices from 'lib/feathers/local/feathersServices';
import TokenDetailView from './TokenDetailView';

const mapStateToProps = (state, ownProps) => {
  console.log('tokendetail state', state);
  return {
    token:
      state.token.queryResult && state.token.queryResult.data
        ? state.token.queryResult.data.filter(
            token => token.address === ownProps.match.params.address
          )[0] || {}
        : {},
    shareholders: state.shareholder.queryResult
      ? state.shareholder.queryResult.data
      : [],
    transactions: state.transaction.queryResult
      ? state.transaction.queryResult.data
      : [],
    loaded:
      state.shareholder.isFinished &&
      state.transaction.isFinished &&
      state.token.isFinished,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    routeTo(path) {
      dispatch(push(path));
    },
    loadShareholders: $skip =>
      dispatch(
        localServices.shareholder.find({
          query: {
            'ethAddresses.issues.address': ownProps.match.params.address,
            $limit: 25,
            $skip,
          },
        })
      ),
    loadTransactions: $skip =>
      dispatch(
        localServices.transaction.find({
          query: {
            contractAddress: ownProps.match.params.address,
            $limit: 25,
            $skip,
          },
        })
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TokenDetailView);

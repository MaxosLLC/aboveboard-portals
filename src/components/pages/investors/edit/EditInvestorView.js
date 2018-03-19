import React, { Component } from 'react';
import { Icon } from 'semantic-ui-react';
import EditInvestorForm from 'components/forms/investor/EditInvestorForm';

class EditInvestorView extends Component {
  componentDidMount() {
    this.props.loadInvestor(this.props.match.params.id);
  }
  render() {
    const { loaded, editInvestor } = this.props;
    return (
      <div className="addInvestorsComponent">
        {!loaded ? (
          <span>
            Loading buyer details...<Icon name="spinner" loading />
          </span>
        ) : (
          <EditInvestorForm {...this.props} onSubmit={editInvestor} />
        )}
      </div>
    );
  }
}

export default EditInvestorView;

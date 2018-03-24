import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Pagination,
  Button,
  Grid,
  Header,
  Icon,
  Table,
} from 'semantic-ui-react';

const qualificationByCode = {
  'us-accredited': 'US Accredited',
  'us-qib': 'US QIB',
};

class InvestorsView extends Component {
  componentDidMount() {
    this.props.loadInvestors(0);
  }

  render() {
    const { loaded, investors, routeTo } = this.props;
    const handleRowClick = investorId => {
      routeTo(`/buyers/${investorId}/detail`);
    };

    return (
      <div className="investorsComponent">
        <Grid centered columns={1}>
          <Grid.Column width={4}>
            <Header as="h2" textAlign="center" style={{ marginBottom: '20px' }}>
              Buyers
            </Header>
          </Grid.Column>
        </Grid>

        {!loaded ? (
          <span>
            Loading buyers...<Icon name="spinner" loading />
          </span>
        ) : (
          <Table celled compact selectable>
            <Table.Header>
              <Table.Row style={{ textAlign: 'center' }}>
                <Table.HeaderCell>#</Table.HeaderCell>
                <Table.HeaderCell>First Name</Table.HeaderCell>
                <Table.HeaderCell>Last Name</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Phone</Table.HeaderCell>
                <Table.HeaderCell>Address</Table.HeaderCell>
                <Table.HeaderCell>Qualifications</Table.HeaderCell>
                <Table.HeaderCell>Edit</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {investors.map((investor, i) => (
                <Table.Row
                  key={investor.id}
                  style={{ cursor: 'pointer', textAlign: 'center' }}
                >
                  <Table.Cell onClick={() => handleRowClick(investor.id)}>
                    {i + 1}
                  </Table.Cell>
                  <Table.Cell onClick={() => handleRowClick(investor.id)}>
                    {investor.firstName}
                  </Table.Cell>
                  <Table.Cell onClick={() => handleRowClick(investor.id)}>
                    {investor.lastName}
                  </Table.Cell>
                  <Table.Cell onClick={() => handleRowClick(investor.id)}>
                    {investor.email}
                  </Table.Cell>
                  <Table.Cell onClick={() => handleRowClick(investor.id)}>
                    {investor.phone}
                  </Table.Cell>
                  <Table.Cell onClick={() => handleRowClick(investor.id)}>
                    {investor.addressLine1}
                    {investor.addressLine2
                      ? ` ${investor.addressLine2},`
                      : ','}{' '}
                    {investor.city},{' '}
                    {investor.state ? `${investor.state}, ` : ''}
                    {investor.country}, {investor.zip}
                  </Table.Cell>
                  <Table.Cell onClick={() => handleRowClick(investor.id)}>
                    {qualificationByCode[investor.qualifications] || ''}
                  </Table.Cell>
                  <Table.Cell
                    style={{ display: 'flex', justifyContent: 'center' }}
                  >
                    <Button
                      onClick={() => routeTo(`/buyers/${investor.id}/edit`)}
                      className="ui button right floated"
                    >
                      Edit
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>

            <Table.Footer>
              <Table.Row stretched>
                <Table.HeaderCell floated="right" colSpan="8">
                  <Pagination
                    floated="right"
                    defaultActivePage={1}
                    totalPages={
                      this.props.queryResult
                        ? Math.floor(
                            this.props.queryResult.total /
                              this.props.queryResult.limit
                          ) + 1
                        : 1
                    }
                    onPageChange={(e, { activePage }) => {
                      this.props.loadInvestors(25 * (activePage - 1));
                    }}
                  />
                </Table.HeaderCell>
              </Table.Row>
              <Table.Row>
                <Table.HeaderCell colSpan="8">
                  <Link to="/buyers/add" className="ui button right floated">
                    Add Buyer
                  </Link>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        )}
      </div>
    );
  }
}

export default InvestorsView;

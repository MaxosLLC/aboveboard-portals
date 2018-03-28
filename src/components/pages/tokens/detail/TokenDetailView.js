import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';

import moment from 'moment';
import {
  Button,
  Pagination,
  Grid,
  Header,
  Icon,
  Segment,
  Tab,
  Table,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class InvestorDetailView extends Component {
  componentDidMount() {
    this.props.loadShareholders();
    this.props.loadTransactions();
  }

  render() {
    const { loaded, token, transactions, shareholders, routeTo } = this.props;

    const getShareholderName = address => {
      const shareholder = shareholders.filter(shareholder =>
        shareholder.ethAddresses.some(
          ethAddress => ethAddress.address === address
        )
      )[0];

      return shareholder && shareholder.firstName
        ? `${shareholder.firstName} ${shareholder.lastName}`
        : '';
    };

    const shareholdersWithData = shareholders.filter(
      shareholder => shareholder.firstName
    );
    const allShareholders = async () => {
      this.props.loadShareholders(0, 0);
      let shareholders = await this.props.shareholders;
      this.props.loadShareholders();
      return shareholders;
    };
    const printShareholders = () => {
      let shareholders;
      allShareholders().then(value => {
        shareholders = value;

        const shareholdersWithData = shareholders.filter(
          shareholder => shareholder.firstName
        );

        let content = shareholdersWithData.length ? (
          <Table celled selectable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>#</Table.HeaderCell>
                <Table.HeaderCell>First Name</Table.HeaderCell>
                <Table.HeaderCell>Last Name</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Phone</Table.HeaderCell>
                <Table.HeaderCell>Address</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {shareholdersWithData.map((shareholder, i) => (
                <Table.Row
                  key={shareholder.id}
                  onClick={() =>
                    routeTo(
                      `/tokens/${token.address}/shareholders/${
                        shareholder.id
                      }/detail`
                    )
                  }
                  style={{ cursor: 'pointer' }}
                >
                  <Table.Cell>{i}</Table.Cell>
                  <Table.Cell>{shareholder.firstName}</Table.Cell>
                  <Table.Cell>{shareholder.lastName}</Table.Cell>
                  <Table.Cell>{shareholder.email}</Table.Cell>
                  <Table.Cell>{shareholder.phone}</Table.Cell>
                  <Table.Cell>
                    {shareholder.addressLine1}{' '}
                    {shareholder.addressLine2
                      ? `${shareholder.addressLine1} `
                      : ''}, {shareholder.city},{' '}
                    {shareholder.state ? `${shareholder.state} ,` : ''}{' '}
                    {shareholder.country}, {shareholder.zip}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        ) : (
          <Segment>No shareholder data available</Segment>
        );

        // ReactDOM.render(content, document.getElementById('iframeContents'))
        let printSection = document.getElementById('iframeContents')
          .contentWindow;
        printSection.document.open();
        printSection.document.write(ReactDOMServer.renderToString(content));
        printSection.document.close();
        printSection.focus();
        printSection.print();
      });
    };

    const panes = [
      {
        menuItem: 'Shareholders',
        render: () =>
          shareholdersWithData.length ? (
            <Table celled selectable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>#</Table.HeaderCell>
                  <Table.HeaderCell>First Name</Table.HeaderCell>
                  <Table.HeaderCell>Last Name</Table.HeaderCell>
                  <Table.HeaderCell>Email</Table.HeaderCell>
                  <Table.HeaderCell>Phone</Table.HeaderCell>
                  <Table.HeaderCell>Address</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {shareholdersWithData.map((shareholder, i) => (
                  <Table.Row
                    key={shareholder.id}
                    onClick={() =>
                      routeTo(
                        `/tokens/${token.address}/shareholders/${
                          shareholder.id
                        }/detail`
                      )
                    }
                    style={{ cursor: 'pointer' }}
                  >
                    <Table.Cell>{i}</Table.Cell>
                    <Table.Cell>{shareholder.firstName}</Table.Cell>
                    <Table.Cell>{shareholder.lastName}</Table.Cell>
                    <Table.Cell>{shareholder.email}</Table.Cell>
                    <Table.Cell>{shareholder.phone}</Table.Cell>
                    <Table.Cell>
                      {shareholder.addressLine1}{' '}
                      {shareholder.addressLine2
                        ? `${shareholder.addressLine1} `
                        : ''}, {shareholder.city},{' '}
                      {shareholder.state ? `${shareholder.state} ,` : ''}{' '}
                      {shareholder.country}, {shareholder.zip}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
              <Table.Footer>
                <Table.Row>
                  <Table.HeaderCell floated="right" colSpan="8">
                    <Button onClick={() => printShareholders()}>
                      Print Shareholders
                    </Button>
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
                        this.props.loadShareholders(25 * (activePage - 1), 25);
                      }}
                    />
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Footer>
            </Table>
          ) : (
            <Segment>No shareholder data available</Segment>
          ),
      },
      {
        menuItem: 'Transactions',
        render: () =>
          transactions.length ? (
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Transaction Hash</Table.HeaderCell>
                  <Table.HeaderCell>Shareholder Name</Table.HeaderCell>
                  <Table.HeaderCell>Shareholder Address</Table.HeaderCell>
                  <Table.HeaderCell>Tokens Transferred</Table.HeaderCell>
                  <Table.HeaderCell>Date</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {transactions.map(transaction => (
                  <Table.Row key={transaction.id}>
                    <Table.Cell>
                      <Link
                        to={`https://kovan.etherscan.io/tx/${
                          transaction.transactionHash
                        }`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {transaction.transactionHash.substr(0, 4)}...{transaction.transactionHash.substr(
                          transaction.transactionHash.length - 4,
                          4
                        )}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      {getShareholderName(transaction.shareholderEthAddress)}
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        to={`https://kovan.etherscan.io/address/${
                          transaction.shareholderEthAddress
                        }`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {transaction.shareholderEthAddress.substr(0, 4)}...{transaction.shareholderEthAddress.substr(
                          transaction.shareholderEthAddress.length - 4,
                          4
                        )}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>{transaction.tokens}</Table.Cell>
                    <Table.Cell>
                      {moment(transaction.createdAt).format('LLL')}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
              <Table.Footer>
                <Table.Row>
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
                        this.props.loadTransactions(25 * (activePage - 1));
                      }}
                    />
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Footer>
            </Table>
          ) : (
            <Segment>No transactions have been made yet</Segment>
          ),
      },
    ];

    return (
      <div className="investorsComponent">
        <iframe
          title="iframeContents"
          id="iframeContents"
          style={{ height: '0px', width: '0px', position: 'absolute' }}
        />
        <Grid centered columns={1}>
          <Grid.Column width={10}>
            <Header as="h2" textAlign="center">
              Token Detail
            </Header>
            <Header as="h3" textAlign="center">
              <Link
                to={`https://kovan.etherscan.io/address/${token.address}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {token.name}
              </Link>
            </Header>
          </Grid.Column>
        </Grid>

        {!loaded ? (
          <span>
            Loading token details...<Icon name="spinner" loading />
          </span>
        ) : (
          <Tab panes={panes} />
        )}
      </div>
    );
  }
}

export default InvestorDetailView;

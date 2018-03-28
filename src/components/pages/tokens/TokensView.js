import React, { Component } from 'react';
import { sortBy } from 'lodash/fp';
import { Link } from 'react-router-dom';
import { Pagination, Grid, Header, Icon, Table } from 'semantic-ui-react';

class TokensView extends Component {
  componentDidMount() {
    this.props.loadTokens();
  }
  render() {
    const { loaded, tokens, watchingTokens, routeTo } = this.props;

    const handleRowClick = tokenAddress => {
      routeTo(`/tokens/${tokenAddress}/detail`);
    };

    const filteredWatchingTokens = tokens.filter(token => {
      return watchingTokens.some(
        watchedToken => token.address === watchedToken.address
      );
    });

    return (
      <div className="tokensComponent">
        <Grid centered columns={1}>
          <Grid.Column width={4}>
            <Header as="h2" textAlign="center">
              Tokens
            </Header>
          </Grid.Column>
        </Grid>

        <br />

        {!loaded ? (
          <span>
            Loading tokens...<Icon name="spinner" loading />
          </span>
        ) : filteredWatchingTokens.length ? (
          <div>
            <Table celled selectable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Token</Table.HeaderCell>
                  <Table.HeaderCell>Contract Address</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {sortBy('name', filteredWatchingTokens).map(token => (
                  <Table.Row
                    key={token.address}
                    onClick={() => handleRowClick(token.address)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Table.Cell>{token.name}</Table.Cell>
                    <Table.Cell>{token.address}</Table.Cell>
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
                        this.props.loadTokens(25 * (activePage - 1));
                      }}
                    />
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Footer>
            </Table>
          </div>
        ) : (
          <span>
            You are currently not watching any tokens. Please visit your{' '}
            <Link to="/settings">settings</Link> to start watching tokens.
          </span>
        )}
      </div>
    );
  }
}

export default TokensView;

import React, { Component } from 'react'
import { sortBy } from 'lodash/fp'
import { Link } from 'react-router-dom'
import { Icon, Table, Button } from 'semantic-ui-react'
import './Tokens.css'

class TokensView extends Component {
  render () {
    const { loaded, tokens, watchingTokens, routeTo } = this.props

    const handleRowClick = tokenAddress => {
      routeTo(`/tokens/${tokenAddress}/detail`)
    }

    const filteredWatchingTokens = tokens.filter(token => {
      return watchingTokens.some(watchedToken => token.address === watchedToken.address)
    })

    return (
      <div className='tokensComponent'>
        { !loaded ? <span>Loading tokens...<Icon name='spinner' loading /></span>
          : filteredWatchingTokens.length
            ? <div className="tokensComponent">
              <Button floated="right" color="teal" onClick={() => routeTo('/settings')}>Add Token</Button>
              <Table className="abTable" stackable={false}>
                <Table.Header className="tableHeader">
                  <Table.Row >
                    <Table.HeaderCell>Token</Table.HeaderCell>
                    <Table.HeaderCell>Contract Address</Table.HeaderCell>
                    <Table.HeaderCell></Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  { sortBy('name', filteredWatchingTokens).map(token =>
                    <Table.Row key={token.address} onClick={() => handleRowClick(token.address)} style={{ cursor: 'pointer' }}>
                      <Table.Cell>{token.name}</Table.Cell>
                      <Table.Cell>{token.address}</Table.Cell>
                      <Table.Cell textAlign="right"><Icon name='angle right' size="large" color="teal" /></Table.Cell>
                    </Table.Row>
                  ) }
                </Table.Body>
              </Table>
            </div>
            : <span>You are currently not watching any tokens. Please visit your <Link to='/settings'>settings</Link> to start watching tokens.</span>
        }
      </div>
    )
  }
}

export default TokensView

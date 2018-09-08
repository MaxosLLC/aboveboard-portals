import React, { Component } from 'react'
import { sortBy } from 'lodash/fp'
import { Link } from 'react-router-dom'
import { Icon, Table, Button, Segment } from 'semantic-ui-react'

class TokensView extends Component {
  componentDidMount () {
    this.props.loadLocalTokens()
  }

  render () {
    const { loaded, localTokens, routeTo } = this.props

    const handleRowClick = tokenAddress => {
      routeTo(`/tokens/${tokenAddress}/detail`)
    }

    const TableRow = Table.Row

    return (
      <div className='tokensComponent'>
        {!loaded
          ? <span>Loading tokens...<Icon name='spinner' loading /></span>
          : localTokens.length
            ? <div className='tokensComponent'>
              <Button floated='left' color='teal' onClick={() => routeTo('/tokens/create')}>Launch Token</Button>
              <Button floated='right' color='teal' onClick={() => routeTo('/settings')}>Add Token</Button>
              <Table className='abTable' unstackable>
                <Table.Header className='tableHeader'>
                  <TableRow >
                    <Table.HeaderCell>Token</Table.HeaderCell>
                    <Table.HeaderCell>Contract Address</Table.HeaderCell>
                    <Table.HeaderCell />
                  </TableRow>
                </Table.Header>
                <Table.Body>
                  {sortBy('name', localTokens).map(token => <TableRow
                    name='tokens'
                    key={token.address}
                    onClick={() => handleRowClick(token.address)}
                    style={{
                      cursor: 'pointer'
                    }}>
                    <Table.Cell>{token.name}</Table.Cell>
                    <Table.Cell>{token.address}</Table.Cell>
                    <Table.Cell textAlign='right'><Icon name='angle right' size='large' color='teal' /></Table.Cell>
                  </TableRow>)}
                </Table.Body>
              </Table>
            </div>
            : <Segment>You are currently not watching any tokens. Please visit your <Link to='/settings'>settings</Link> to start watching tokens or <Button color='teal' onClick={() => routeTo('/tokens/create')}>Launch A New Token</Button></Segment>
}
      </div>
    )
  }
}

export default TokensView

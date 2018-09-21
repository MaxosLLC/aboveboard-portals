import React, { Component } from 'react'
import { sortBy } from 'lodash/fp'
import { map } from 'bluebird'
import { Icon, Table, Button, Segment } from 'semantic-ui-react'

import ethereum from 'lib/ethereum'

class TokensView extends Component {
  constructor (props) {
    super(props)
    this.state = { loaded: false }
  }

  async componentDidMount () {
    await this.props.loadWhitelists()
    await this.props.loadLocalTokens()

    const localTokens = await map(this.props.localTokens, async localToken => {
      const whitelistAddresses = await ethereum.getWhitelistsForToken(localToken.address).catch(e => console.log(`Could not get whitelists for token ${localToken.address}`))
      const whitelists = whitelistAddresses.map(whitelistAddress => {
        return this.props.whitelists.filter(whitelist => whitelist.address === whitelistAddress)[0].name
      })

      return Object.assign({}, localToken, { whitelists })
    })

    this.setState({ localTokens, loaded: true })
  }

  render () {
    const { routeTo } = this.props
    const { loaded, localTokens } = this.state

    const handleRowClick = tokenAddress => {
      routeTo(`/securities/${tokenAddress}/detail`)
    }

    const TableRow = Table.Row

    return (
      <div className='tokensComponent'>
        {!loaded
          ? <span>Loading tokens...<Icon name='spinner' loading /></span>
          : localTokens.length
            ? <div className='tokensComponent'>
              <Button floated='left' color='teal' onClick={() => routeTo('/securities/create')}>Create Security Token</Button>
              <Table className='abTable' unstackable>
                <Table.Header className='tableHeader'>
                  <TableRow >
                    <Table.HeaderCell>Token</Table.HeaderCell>
                    <Table.HeaderCell>Contract Address</Table.HeaderCell>
                    <Table.HeaderCell>Whitelists</Table.HeaderCell>
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
                    <Table.Cell>{ token.whitelists && token.whitelists.join(', ') }</Table.Cell>
                  </TableRow>)}
                </Table.Body>
              </Table>
            </div>
            : <Segment>You do not have any security tokens. <Button color='teal' onClick={() => routeTo('/securities/create')}>Create A Security Token</Button></Segment>
        }
      </div>
    )
  }
}

export default TokensView

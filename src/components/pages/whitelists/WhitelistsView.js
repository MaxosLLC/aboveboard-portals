import React, { Component } from 'react'
import { each } from 'bluebird'
import { Link } from 'react-router-dom'
import { Button, Grid, Icon, Image, Input, Pagination, Segment, Table } from 'semantic-ui-react'

import ethereum from 'lib/ethereum'

const iconsPath = '/images/icons'
const sortUpSrc = `${iconsPath}/up.svg`
const sortDownSrc = `${iconsPath}/down.svg`

class WhitelistsView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loaded: false,
      roleByWhitelist: {},
      whitelistsByToken: {},
      tokensByWhitelist: {}
    }
  }

  async componentDidMount () {
    await this.props.loadWhitelists()
    await this.props.loadLocalTokens()

    if (this.props.currentUser.role === 'issuer' || this.props.currentUser.role === 'direct') {
      const whitelistsByToken = {}
      const tokensByWhitelist = {}

      await each(this.props.localTokens, async localToken => {
        const whitelistAddresses = await ethereum.getWhitelistsForToken(localToken.address).catch(e => console.log(`Could not get whitelists for token ${localToken.address}`))
        whitelistsByToken[localToken.address] = whitelistAddresses
        whitelistAddresses.forEach(whitelistAddresses => {
          if (tokensByWhitelist[whitelistAddresses]) {
            if (tokensByWhitelist[whitelistAddresses].indexOf(localToken.address) === -1) {
              tokensByWhitelist[whitelistAddresses].push(localToken.address)
            }
          } else {
            tokensByWhitelist[whitelistAddresses] = [localToken.address]
          }
        })
      })

      this.setState({ whitelistsByToken, tokensByWhitelist })
    }

    if (this.props.currentUser.role === 'broker' || this.props.currentUser.role === 'direct') {
      const roleByWhitelist = {}

      await each(this.props.whitelists, async whitelist => {
        const role = await ethereum.getRoleForWhitelist(this.props.currentUser, whitelist).catch(e => console.log(`Could not get role for whitelist ${whitelist.address}`))
        roleByWhitelist[whitelist.address] = role
      })

      this.setState({ roleByWhitelist })
    }

    this.setState({ loaded: true })
  }

  render () {
    const { routeTo, whitelists, localTokens, setPage, setSort, setSearch, page, search, queryResult } = this.props
    const { tokensByWhitelist, roleByWhitelist, loaded } = this.state

    const whitelistHeaders = [
      { name: 'Name', sortOption: 'name' },
      { name: 'Qualifier', sortOption: 'qualifier' },
      { name: 'Type', sortOption: 'type' },
      { name: 'Address', sortOption: 'address' },
      { name: 'Role' },
      { name: 'Tokens' }
    ]

    return (
      <div className='whitelistsComponent'>
        <Grid style={{ marginTop: '10px' }}>
          <Grid.Column floated='left' width={5}>
            { loaded && <Input loading={!loaded} icon='dollar' placeholder='Search...' onChange={(e, { value }) => { setSearch(value) }} value={search} /> }
          </Grid.Column>
          <Grid.Column floated='right' width={5}>
            <Button onClick={() => routeTo('/whitelists/create')}>Create Whitelist</Button>
          </Grid.Column>
        </Grid>
        {!loaded
          ? <span>Loading whitelists...<Icon name='spinner' loading /></span>
          : whitelists.length
          ? <div className='tableContainer'>
            <div className='tableScrollContainer'>
              <Table className='abTable' unstackable>
                <Table.Header className='tableHeader'>
                  <Table.Row>
                    { whitelistHeaders.map((transactionsHeader, i) =>
                      transactionsHeader.name === 'action'
                      ? <Table.HeaderCell key={`${transactionsHeader.name}${i}`}>{transactionsHeader.name}</Table.HeaderCell>
                      : <Table.HeaderCell key={`${transactionsHeader.name}${i}`}>{transactionsHeader.name}
                        { transactionsHeader.name !== 'Role' && transactionsHeader.name !== 'Tokens' && <span className='sortButtons'>
                          <Image
                            src={sortUpSrc}
                            onClick={() => { setSort({ [transactionsHeader.sortOption]: 1 }) }} />
                          <Image
                            src={sortDownSrc}
                            onClick={() => { setSort({ [transactionsHeader.sortOption]: -1 }) }} />
                        </span> }
                      </Table.HeaderCell>
                    ) }
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {whitelists
                      .map(whitelist => <Table.Row key={whitelist.id}>
                        <Table.Cell>{whitelist.name}</Table.Cell>
                        <Table.Cell>{whitelist.qualifier}</Table.Cell>
                        <Table.Cell>{whitelist.type}</Table.Cell>
                        <Table.Cell>
                          <Link
                            to={`https://${window.REACT_APP_APP_TYPE && !/(enegra|polymath)/.test(window.location.hostname) ? '' : 'kovan.'}etherscan.io/address/${whitelist.address}`}
                            target='_blank'
                            rel='noopener noreferrer'>
                            {whitelist
                              .address
                              .substr(0, 4)}...{whitelist
                              .address
                              .substr(whitelist.address.length - 4, 4)}
                          </Link>
                        </Table.Cell>
                        <Table.Cell>{ roleByWhitelist[whitelist.address] }</Table.Cell>
                        <Table.Cell>{ tokensByWhitelist[whitelist.address] && tokensByWhitelist[whitelist.address].map(localTokenAddress => localTokens.filter(({ address }) => address === localTokenAddress)[0].name).join(', ') }</Table.Cell>
                      </Table.Row>)}
                </Table.Body>

                { queryResult.whitelists.total > queryResult.whitelists.limit && <Table.Footer>
                  <Table.Row>
                    <Table.HeaderCell floated='right' colSpan={whitelistHeaders.length}>
                      <Pagination
                        floated='right'
                        activePage={page + 1}
                        totalPages={
                          queryResult.whitelists
                            ? Math.floor(
                                queryResult.whitelists.total /
                                  queryResult.whitelists.limit
                              ) + 1
                            : 1
                        }
                        onPageChange={(e, { activePage }) => setPage(activePage - 1)}
                      />
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Footer> }
              </Table>
            </div>
          </div>
          : <Segment>{ search ? 'No whitelists match your search criteria' : 'No whitelists have been made yet' }</Segment>
        }
      </div>
    )
  }
}

export default WhitelistsView

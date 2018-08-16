import React, { Component } from 'react'
import { each } from 'bluebird'
import { Link } from 'react-router-dom'
import { Button, Header, Icon, Image, Input, Pagination, Segment, Table } from 'semantic-ui-react'

import ethereum from 'lib/ethereum'
import './Whitelists.css'

const iconsPath = '/images/icons'
const sortUpSrc = `${iconsPath}/up.svg`
const sortDownSrc = `${iconsPath}/down.svg`

class PendingTransactionsView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      roleByWhitelist: {},
      whitelistsByToken: {}
    }
  }

  async componentDidMount () {
    await this.props.loadWhitelists()
    await this.props.loadLocalTokens()

    if (this.props.currentUser.role === 'issuer' || this.props.currentUser.role === 'direct') {
      const whitelistsByToken = {}

      await each(this.props.localTokens, async localToken => {
        const whitelists = await ethereum.getWhitelistsForToken(localToken.address)
        whitelistsByToken[localToken.address] = whitelists
      })

      this.setState({ whitelistsByToken })
    }

    if (this.props.currentUser.role === 'broker' || this.props.currentUser.role === 'direct') {
      const roleByWhitelist = {}

      await each(this.props.whitelists, async whitelist => {
        const role = await ethereum.getRoleForWhitelist(this.props.currentUser, whitelist)
        roleByWhitelist[whitelist.address] = role
      })
    }
  }

  render () {
    const { loaded, whitelists, setPage, setSort, setSearch, page, search, queryResult } = this.props

    const whitelistHeaders = [
      { name: 'Name', sortOption: 'name' },
      { name: 'Qualifier', sortOption: 'qualifier' },
      { name: 'Type', sortOption: 'type' },
      { name: 'Address', sortOption: 'address' },
      { name: 'Actions' }
    ]

    return (
      <div className='whitelistsComponent'>
        <Header as='h2'>Whitelists</Header>
        <div>
          <Input loading={!loaded} icon='dollar' placeholder='Search...' onChange={(e, { value }) => { setSearch(value) }} value={search} />
        </div>
        <br />
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
                        <span className='sortButtons'>
                          <Image
                            src={sortUpSrc}
                            onClick={() => { setSort({ [transactionsHeader.sortOption]: 1 }) }} />
                          <Image
                            src={sortDownSrc}
                            onClick={() => { setSort({ [transactionsHeader.sortOption]: -1 }) }} />
                        </span>
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
                        <Table.Cell>{ whitelist.type !== 'affiliate' && <Button>Request Distribution</Button> }</Table.Cell>
                      </Table.Row>)}
                </Table.Body>

                <Table.Footer>
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
                </Table.Footer>
              </Table>
            </div>
          </div>
          : <Segment>{ search ? 'No whitelists match your search criteria' : 'No whitelists have been made yet' }</Segment>
        }
      </div>
    )
  }
}

export default PendingTransactionsView

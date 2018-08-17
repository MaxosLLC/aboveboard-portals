import React, { Component } from 'react'
import { each } from 'bluebird'
import { Link } from 'react-router-dom'
import { Button, Header, Icon, Image, Input, Pagination, Segment, Table } from 'semantic-ui-react'

import ethereum from 'lib/ethereum'
import './WhitelistsAvailable.css'

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
        <Header as='h2'>Token: Aboveboard Demo Token</Header>
        <Header as='h3'>Type:</Header>
        <Header as='h3'>Issue Compliance:</Header>
        <Header as='h3'>Disclosure Policy:</Header>
        <br />
        <Header as='h2'>Avaiable Whitelists</Header>
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
                      <Table.HeaderCell>Name</Table.HeaderCell>
                      <Table.HeaderCell>Qualifier</Table.HeaderCell>
                      <Table.HeaderCell>Type</Table.HeaderCell>
                      <Table.HeaderCell>Address</Table.HeaderCell>
                      <Table.HeaderCell>Actions</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  <Table.Row>
                    <Table.Cell>Company Direct Sales Portal</Table.Cell>
                    <Table.Cell>Company</Table.Cell>
                    <Table.Cell>Affiliate</Table.Cell>
                    <Table.Cell>0xa17e0034227d67a022ec031fc88dc04f31f61e84</Table.Cell>
                    <Table.Cell></Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Company Affiliates</Table.Cell>
                    <Table.Cell>Company</Table.Cell>
                    <Table.Cell>Accredited</Table.Cell>
                    <Table.Cell>0xa17e0034227d67a022ec031fc88dc04f31f61e84</Table.Cell>
                    <Table.Cell><Button>Apply For Your Portal</Button></Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Aboveboard US QIB</Table.Cell>
                    <Table.Cell>Aboveboard</Table.Cell>
                    <Table.Cell>QIB</Table.Cell>
                    <Table.Cell>0xa17e0034227d67a022ec031fc88dc04f31f61e84</Table.Cell>
                    <Table.Cell><Button>Apply For Distribution</Button></Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>US Broker-Dealer</Table.Cell>
                    <Table.Cell>A Broker</Table.Cell>
                    <Table.Cell>US Accredited</Table.Cell>
                    <Table.Cell>0xa17e0034227d67a022ec031fc88dc04f31f61e84</Table.Cell>
                    <Table.Cell><Button>Apply For Distribution</Button></Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Japan Broker</Table.Cell>
                    <Table.Cell>Japan Broker</Table.Cell>
                    <Table.Cell>Sophisticated</Table.Cell>
                    <Table.Cell>0xa17e0034227d67a022ec031fc88dc04f31f61e84</Table.Cell>
                    <Table.Cell><Button>Apply For Distribution</Button></Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Exchange 1</Table.Cell>
                    <Table.Cell>Exchange 1</Table.Cell>
                    <Table.Cell>Reg S</Table.Cell>
                    <Table.Cell>0xa17e0034227d67a022ec031fc88dc04f31f61e84</Table.Cell>
                    <Table.Cell><Button>Apply For Distribution</Button></Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Exchange 2</Table.Cell>
                    <Table.Cell>Exchange 2</Table.Cell>
                    <Table.Cell>Sophisticated</Table.Cell>
                    <Table.Cell>0xa17e0034227d67a022ec031fc88dc04f31f61e84</Table.Cell>
                    <Table.Cell><Button>Apply For Distribution</Button></Table.Cell>
                  </Table.Row>
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

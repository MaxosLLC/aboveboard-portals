import React, { Component } from 'react'
import { Button, Grid, Header, Icon, Image, Input, Segment, Table } from 'semantic-ui-react'

import './WhitelistsAvailable.css'

const iconsPath = '/images/icons'
const sortUpSrc = `${iconsPath}/up.svg`
const sortDownSrc = `${iconsPath}/down.svg`

class WhitelistsAvailableView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      roleByWhitelist: {},
      whitelistsByToken: {}
    }
  }

  async componentDidMount () {
    // await this.props.loadWhitelists()
    // await this.props.loadLocalTokens()

    // if (this.props.currentUser.role === 'issuer' || this.props.currentUser.role === 'direct') {
    //   const whitelistsByToken = {}

    //   await each(this.props.localTokens, async localToken => {
    //     const whitelists = await ethereum.getWhitelistsForToken(localToken.address)
    //     whitelistsByToken[localToken.address] = whitelists
    //   })

    //   this.setState({ whitelistsByToken })
    // }

    // if (this.props.currentUser.role === 'broker' || this.props.currentUser.role === 'direct') {
    //   const roleByWhitelist = {}

    //   await each(this.props.whitelists, async whitelist => {
    //     try {
    //       const role = await ethereum.getRoleForWhitelist(this.props.currentUser, whitelist)
    //       roleByWhitelist[whitelist.address] = role
    //     } catch (e) {
    //       console.log(`Could not get role for whitelist ${whitelist}`)
    //     }
    //   })
    // }
  }

  render () {
    const { loaded, routeTo, whitelists, setSearch, search } = this.props

    return (
      <div className='whitelistsComponent'>
        <Segment>
          <Header as='h1'>Mockup</Header>
          <div>Please contact us at <a href='mailto:contact@aboveboard.ai'>contact@aboveboard.ai</a></div>
        </Segment>
        <Grid style={{ marginTop: '10px' }}>
          <Grid.Column floated='left' width={5}>
            <Header as='h2'>Token: Company Common Shares</Header>
            <Header as='h3'>More information about this project <Button style={{ marginLeft: '10px' }}>Add A Link</Button></Header>
          </Grid.Column>
          <Grid.Column floated='right' width={5}>
            <Button onClick={() => routeTo('/whitelisting/create')}>Create Whitelist</Button>
          </Grid.Column>
        </Grid>
        <Grid style={{ marginTop: '10px' }}>
          <Grid.Column floated='left' width={5}>
            <Header as='h2'>Available Whitelists</Header>
          </Grid.Column>
          <Grid.Column floated='right' width={5}>
            <Input style={{ position: 'relative', top: '-10px', color: 'black' }} loading={!loaded} icon='dollar' placeholder='Search...' onChange={(e, { value }) => { setSearch(value) }} value={search} />
          </Grid.Column>
        </Grid>
        {!loaded
          ? <span>Loading whitelists...<Icon name='spinner' loading /></span>
          : whitelists.length
          ? <div className='tableContainer'>
            <Table className='abTable' unstackable compact>
              <Table.Header className='tableHeader'>
                <Table.Row>
                  <Table.HeaderCell>Name <span className='sortButtons'>
                    <Image
                      src={sortUpSrc} />
                    <Image
                      src={sortDownSrc} />
                  </span>
                  </Table.HeaderCell>
                  <Table.HeaderCell>Qualifier <span className='sortButtons'>
                    <Image
                      src={sortUpSrc} />
                    <Image
                      src={sortDownSrc} />
                  </span></Table.HeaderCell>
                  <Table.HeaderCell>Type <span className='sortButtons'>
                    <Image
                      src={sortUpSrc} />
                    <Image
                      src={sortDownSrc} />
                  </span></Table.HeaderCell>
                  <Table.HeaderCell>Actions</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                <Table.Row>
                  <Table.Cell>Company Affiliates</Table.Cell>
                  <Table.Cell>Company</Table.Cell>
                  <Table.Cell>Affiliate</Table.Cell>
                  <Table.Cell />
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Company Direct Sales Portal</Table.Cell>
                  <Table.Cell>Company</Table.Cell>
                  <Table.Cell>Accredited</Table.Cell>
                  <Table.Cell><Button>Request Your Portal</Button></Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Aboveboard US QIB</Table.Cell>
                  <Table.Cell>Aboveboard</Table.Cell>
                  <Table.Cell>QIB</Table.Cell>
                  <Table.Cell><Button>Request Distribution</Button></Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>US Broker-Dealer</Table.Cell>
                  <Table.Cell>A Broker</Table.Cell>
                  <Table.Cell>US Accredited</Table.Cell>
                  <Table.Cell><Button>Request Distribution</Button></Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Japan Broker</Table.Cell>
                  <Table.Cell>Japan Broker</Table.Cell>
                  <Table.Cell>Sophisticated</Table.Cell>
                  <Table.Cell><Button>Request Distribution</Button></Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Exchange 1</Table.Cell>
                  <Table.Cell>Exchange 1</Table.Cell>
                  <Table.Cell>Unregulated Only</Table.Cell>
                  <Table.Cell><Button>Request Distribution</Button></Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Exchange 2</Table.Cell>
                  <Table.Cell>Exchange 2</Table.Cell>
                  <Table.Cell>Sophisticated</Table.Cell>
                  <Table.Cell><Button>Request Distribution</Button></Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </div>
          : <Segment>{ search ? 'No whitelists match your search criteria' : 'No whitelists have been made yet' }</Segment>
        }
      </div>
    )
  }
}

export default WhitelistsAvailableView

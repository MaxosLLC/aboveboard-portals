import React, { Component } from 'react'
import { Grid, Header, Image, Table } from 'semantic-ui-react'

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
    return (
      <div className='whitelistsComponent'>
        <Grid style={{ marginTop: '10px' }}>
          <Grid.Column floated='left' width={12}>
            <Header as='h2'>Available Whitelists</Header>
          </Grid.Column>
        </Grid>
        <div className='tableContainer'>
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
                <Table.Cell><a className='ui button' href='mailto:contact@aboveboard.ai'>Request Your Portal</a></Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Aboveboard US QIB</Table.Cell>
                <Table.Cell>Aboveboard</Table.Cell>
                <Table.Cell>QIB</Table.Cell>
                <Table.Cell><a className='ui button' href='mailto:contact@aboveboard.ai'>Request Distribution</a></Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>US Broker-Dealer</Table.Cell>
                <Table.Cell>A Broker</Table.Cell>
                <Table.Cell>US Accredited</Table.Cell>
                <Table.Cell><a className='ui button' href='mailto:contact@aboveboard.ai'>Request Distribution</a></Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Japan Broker</Table.Cell>
                <Table.Cell>Japan Broker</Table.Cell>
                <Table.Cell>Sophisticated</Table.Cell>
                <Table.Cell><a className='ui button' href='mailto:contact@aboveboard.ai'>Request Distribution</a></Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Exchange 1</Table.Cell>
                <Table.Cell>Exchange 1</Table.Cell>
                <Table.Cell>Unregulated Only</Table.Cell>
                <Table.Cell><a className='ui button' href='mailto:contact@aboveboard.ai'>Request Distribution</a></Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Exchange 2</Table.Cell>
                <Table.Cell>Exchange 2</Table.Cell>
                <Table.Cell>Sophisticated</Table.Cell>
                <Table.Cell><a className='ui button' href='mailto:contact@aboveboard.ai'>Request Distribution</a></Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
      </div>
    )
  }
}

export default WhitelistsAvailableView

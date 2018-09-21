import React, { Component } from 'react'
import { Grid, Header, Icon, Table } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

class InvestorDetailView extends Component {
  componentDidMount () {
    this.props.loadInvestor(this.props.currentUser)
  }

  render () {
    const { currentUser, loaded, investor, whitelists } = this.props

    const getWhitelistName = address => {
      const whitelist = whitelists.filter(
        whitelist => whitelist.address === address
      )

      return whitelist && whitelist[0] ? whitelist[0].name : address
    }

    return (
      <div className='investorsComponent'>
        <Grid centered columns={1}>
          <Grid.Column width={4}>
            <Header as='h2' textAlign='center'>
              Buyer Detail
            </Header>
          </Grid.Column>
        </Grid>

        <br />

        {!loaded ? (
          <span>
            Loading buyer details...<Icon name='spinner' loading />
          </span>
        ) : (
          <div>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>First Name</Table.HeaderCell>
                  <Table.HeaderCell>Last Name</Table.HeaderCell>
                  <Table.HeaderCell>Email</Table.HeaderCell>
                  <Table.HeaderCell>Phone</Table.HeaderCell>
                  <Table.HeaderCell>Address</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                <Table.Row key={investor.id}>
                  <Table.Cell>{investor.firstName}</Table.Cell>
                  <Table.Cell>{investor.lastName}</Table.Cell>
                  <Table.Cell>{investor.email}</Table.Cell>
                  <Table.Cell>{investor.phone}</Table.Cell>
                  <Table.Cell>
                    {investor.addressLine1}
                    {investor.addressLine2
                      ? ` ${investor.addressLine1},`
                      : ','}{' '}
                    {investor.city},{' '}
                    {investor.state ? `${investor.state} ,` : ''}{' '}
                    {investor.country}, {investor.zip}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>

            <Header as='h2' textAlign='center'>
              Ethereum Addresses
            </Header>

            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Address</Table.HeaderCell>
                  <Table.HeaderCell>Whitelists</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {(investor.ethAddresses || []).map(ethAddress => {
                  return (
                    <Table.Row key={ethAddress.address}>
                      <Table.Cell>
                        <Link
                          to={`https://${window.REACT_APP_APP_TYPE && !/(enegra|polymath|kovan)/.test(window.location.hostname) ? '' : 'kovan.'}etherscan.io/address/${
                            ethAddress.address
                          }`}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          {ethAddress.address}
                        </Link>
                      </Table.Cell>
                      <Table.Cell>
                        {(ethAddress.whitelists || []).map(whitelist => {
                          return (
                            <p key={whitelist.address}>
                              <Link
                                to={`https://${window.REACT_APP_APP_TYPE && !/(enegra|polymath|kovan)/.test(window.location.hostname) ? '' : 'kovan.'}etherscan.io/address/${
                                  whitelist.address
                                }`}
                                target='_blank'
                                rel='noopener noreferrer'
                              >
                                {getWhitelistName(whitelist.address)}
                              </Link>
                            </p>
                          )
                        })}
                      </Table.Cell>
                    </Table.Row>
                  )
                })}
              </Table.Body>
            </Table>

            <Grid centered columns={1}>
              <Grid.Column width={4}>
                { currentUser.role !== 'buyer' &&
                  <Link to='/owners' className='ui button primary'>
                    Back to Buyers
                  </Link>
                }
                <Link to={`/owners/${investor.id}/edit`} className='ui button primary'>
                  Edit
                </Link>
              </Grid.Column>
            </Grid>
          </div>
        )}
      </div>
    )
  }
}

export default InvestorDetailView

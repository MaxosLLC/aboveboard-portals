import React, { Component } from 'react'
import { Grid, Header, Icon, Table } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

class ShareholderDetailView extends Component {
  componentDidMount () {
    this.props.loadShareholder()
  }

  render () {
    const { loaded, shareholder, tokens } = this.props

    const getTokenName = address => {
      const token = tokens.filter(token => token.address === address)

      return token && token[0] ? token[0].name : address
    }

    return (
      <div className='shareholdersComponent'>
        <Grid centered columns={1}>
          <Grid.Column width={4}>
            <Header as='h2' textAlign='center'>Shareholder Detail</Header>
          </Grid.Column>
        </Grid>

        <br />

        { !loaded ? <span>Loading shareholder details...<Icon name='spinner' loading /></span>
          : <div>
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
                <Table.Row key={shareholder.recipient}>
                  <Table.Cell>{shareholder.firstName}</Table.Cell>
                  <Table.Cell>{shareholder.lastName}</Table.Cell>
                  <Table.Cell>{shareholder.email}</Table.Cell>
                  <Table.Cell>{shareholder.phone}</Table.Cell>
                  <Table.Cell>{shareholder.addressLine1}{shareholder.addressLine2 ? ` ${shareholder.addressLine1},` : ','} {shareholder.city}, {shareholder.state ? `${shareholder.state} ,` : ''} {shareholder.country}, {shareholder.zip}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>

            <Header as='h2' textAlign='center'>Ethereum Addresses</Header>

            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Address</Table.HeaderCell>
                  <Table.HeaderCell>Tokens</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                { (shareholder.ethAddresses || []).map(ethAddress => {
                  return <Table.Row key={ethAddress.address}>
                    <Table.Cell><Link to={`https://kovan.etherscan.io/address/${ethAddress.address}`} target='_blank' rel='noopener noreferrer'>{ethAddress.address}</Link></Table.Cell>
                    <Table.Cell>{(ethAddress.issues || []).map(issue => {
                      return <p key={issue.address}>
                        <Link to={`/tokens/${issue.address}/detail`}>{getTokenName(issue.address)}</Link> <Link to={`https://kovan.etherscan.io/address/${issue.address}`} target='_blank' rel='noopener noreferrer'>(View on Etherscan)</Link>, Balance: {issue.tokens}
                      </p>
                    })}</Table.Cell>
                  </Table.Row>
                })}
              </Table.Body>
            </Table>

            <Grid centered columns={1}>
              <Grid.Column width={4}>
                <Link to='/tokens' className='ui button primary'>Back to Tokens</Link>
              </Grid.Column>
            </Grid>
          </div>
        }
      </div>
    )
  }
}

export default ShareholderDetailView

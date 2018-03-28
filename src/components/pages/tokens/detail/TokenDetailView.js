import React, { Component } from 'react'
import moment from 'moment'
import { Grid, Header, Icon, Segment, Tab, Table, Image } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import ColorRegistry from '../../../../assets/ColorRegistry'
import tokenIcon from '../../../../assets/image/Info.png'
import userGraphic from '../../../../assets/image/graphic.png'
import path from '../../../../assets/image/Path.png'
import './TokenDetail.css'

const TokenDetailView = styled.div`
  margin-top: 0px;
`

const TokenDetailHeader = styled.h2`
  font-size: 32px;
  color: ${ColorRegistry.headColor};
  font-family: 'Futura Medium';
  font-weight: 200;'
`

const TypeCountLabel = styled.h3`
  font-size: 42px;
  color: ${ColorRegistry.bodyColor};
  font-weight: 600;
  line-height: 1;
  font-family: 'ProximaNova Regular';
`

const TypeLabel = styled.p`
  font-size: 18px;
  color: ${ColorRegistry.bodyColor};
  line-height: 1.22;
`

class InvestorDetailView extends Component {
  componentDidMount () {
    this.props.loadShareholders()
    this.props.loadTransactions()
  }

  render () {

    const { loaded, token, transactions, shareholders, routeTo } = this.props
    const getShareholderName = address => {
      const shareholder = shareholders.filter(shareholder => shareholder.ethAddresses.some(ethAddress => ethAddress.address === address))[0]

      return shareholder && shareholder.firstName ? `${shareholder.firstName} ${shareholder.lastName}` : ''
    }

    const shareholdersWithData = shareholders.filter(shareholder => shareholder.firstName)

    const panes = [
      { menuItem: 'Shareholders',
        render: () =>
          shareholdersWithData.length ? <Table celled selectable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>#</Table.HeaderCell>
                <Table.HeaderCell>First Name</Table.HeaderCell>
                <Table.HeaderCell>Last Name</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Phone</Table.HeaderCell>
                <Table.HeaderCell>Address</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              { shareholdersWithData.map((shareholder, i) =>
                <Table.Row key={shareholder.id} onClick={() => routeTo(`/tokens/${token.address}/shareholders/${shareholder.id}/detail`)} style={{ cursor: 'pointer' }}>
                  <Table.Cell>{i}</Table.Cell>
                  <Table.Cell>{shareholder.firstName}</Table.Cell>
                  <Table.Cell>{shareholder.lastName}</Table.Cell>
                  <Table.Cell>{shareholder.email}</Table.Cell>
                  <Table.Cell>{shareholder.phone}</Table.Cell>
                  <Table.Cell>{shareholder.addressLine1} {shareholder.addressLine2 ? `${shareholder.addressLine1} ` : ''}, {shareholder.city}, {shareholder.state ? `${shareholder.state} ,` : ''} {shareholder.country}, {shareholder.zip}</Table.Cell>
                </Table.Row>
            ) }
            </Table.Body>
          </Table>
        : <Segment>No shareholder data available</Segment>
      },
      { menuItem: 'Transactions',
        render: () =>
          transactions.length ? <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Transaction Hash</Table.HeaderCell>
                <Table.HeaderCell>Shareholder Name</Table.HeaderCell>
                <Table.HeaderCell>Shareholder Address</Table.HeaderCell>
                <Table.HeaderCell>Tokens Transferred</Table.HeaderCell>
                <Table.HeaderCell>Date</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              { transactions.map(transaction =>
                <Table.Row key={transaction.id}>
                  <Table.Cell>
                    <Link to={`https://kovan.etherscan.io/tx/${transaction.transactionHash}`} target='_blank' rel='noopener noreferrer'>
                      {transaction.transactionHash.substr(0, 4)}...{transaction.transactionHash.substr(transaction.transactionHash.length - 4, 4)}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    {getShareholderName(transaction.shareholderEthAddress)}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`https://kovan.etherscan.io/address/${transaction.shareholderEthAddress}`} target='_blank' rel='noopener noreferrer'>
                      {transaction.shareholderEthAddress.substr(0, 4)}...{transaction.shareholderEthAddress.substr(transaction.shareholderEthAddress.length - 4, 4)}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{transaction.tokens}</Table.Cell>
                  <Table.Cell>{moment(transaction.createdAt).format('LLL')}</Table.Cell>
                </Table.Row>
            ) }
            </Table.Body>
          </Table>
          : <Segment>No transactions have been made yet</Segment>
      }
    ]

    return (
      <TokenDetailView>
        <Grid columns={1}>
          <Grid.Column>
            <TokenDetailHeader> Aboveboard Common Stock <img src={tokenIcon} /></TokenDetailHeader> 
          </Grid.Column>
        </Grid>
        <Grid columns={2} className='typeBoards'>
          <Grid.Column className='typeBoard' width={5} textAlign='center'>
            <Image src={userGraphic} centered verticalAlign='middle' className='boardImage' />
            <TypeCountLabel> 2000 </TypeCountLabel>
            <TypeLabel> Shareholders </TypeLabel>
          </Grid.Column>
          <Grid.Column className='typeBoard' width={5} textAlign='center' style={{ marginLeft: 30 }}>
            <Image src={path} centered verticalAlign='middle' className='boardImage' />
            <TypeCountLabel> 256+ </TypeCountLabel>
            <TypeLabel> Total Transactions </TypeLabel>
          </Grid.Column>    
        </Grid>


        { !loaded ? <span>Loading token details...<Icon name='spinner' loading /></span> : <Tab panes={panes} style={{marginTop: 50}}/> }
      </TokenDetailView>
    )
  }
}

export default InvestorDetailView

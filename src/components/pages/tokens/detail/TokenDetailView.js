import React, { Component } from 'react'
import moment from 'moment'
import { Header, Icon, Segment, Tab, Table, Checkbox, Image, Modal} from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import StatsCard from './../../../statsCard/StatsCard'
import './TokenDetail.css'

const userSrc = '../../images/icons/user.svg'
const graphSrc = '../../images/icons/graph.svg'
const calendarSrc = '../../images/icons/calendar.svg'
const downloadSrc = '../../images/icons/download.svg'

class InvestorDetailView extends Component {
  componentDidMount () {
    this.props.loadShareholders()
    this.props.loadTransactions()
  }
  transactionsPerShareholder = (ethAddress, transactions) => {  
      return transactions.filter(ta => ta.shareholderEthAddress === ethAddress).length
    }
  transactionPercent = (ethAddress, transactions) => {
      const shareHoldersTransactions = transactions.filter(ta => ta.shareholderEthAddress === ethAddress).length
      return ((shareHoldersTransactions/transactions.length)*100)
  }
  lastTransactionDate = (ethAddress, transactions) => {
      return transactions.filter(ta => ta.shareholderEthAddress === ethAddress)
      .map(ta => ta.createdAt)[0]
  }
  render () {
    const { loaded, token, transactions, shareholders, routeTo } = this.props
    const getShareholderName = address => {
      const shareholder = shareholders.filter(shareholder => shareholder.ethAddresses.some(ethAddress => ethAddress.address === address))[0]
      return shareholder && shareholder.firstName ? `${shareholder.firstName} ${shareholder.lastName}` : ''
    }
    const shareholdersWithData = shareholders.filter(shareholder => shareholder.firstName)
    const stats = [
      {title: 'Shareholders', data: shareholdersWithData.length, icon: {src: userSrc, size: '55px'}},
      {title: 'Total Transactions', data: `${transactions.length}+`, icon: {src: graphSrc, size: '80%'}}
    ]

    const modalTrigger = <Image src={calendarSrc}/>

    const panes = [
      { menuItem: 'Shareholders',
        render: () =>
          shareholdersWithData.length ? <div className="tableContainer"> 
          <Table className="abTable" unstackable>
            <Table.Header className="tableHeader">
              <Table.Row>
               <Table.HeaderCell style={{color: '#8f9bab'}}>ID</Table.HeaderCell>
                <Table.HeaderCell>Shareholder</Table.HeaderCell>
                <Table.HeaderCell>Address</Table.HeaderCell>
                <Table.HeaderCell>Qaulifier</Table.HeaderCell>
                <Table.HeaderCell>Quantity</Table.HeaderCell>
                <Table.HeaderCell>% of Total</Table.HeaderCell>
                <Table.HeaderCell>Last Transaction</Table.HeaderCell>
                <Table.HeaderCell><Image src={downloadSrc} className="download"/></Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              { shareholdersWithData.map((shareholder, i) =>
                <Table.Row key={shareholder.id} onClick={() => routeTo(`/tokens/${token.address}/shareholders/${shareholder.id}/detail`)} style={{ cursor: 'pointer' }}>
                  <Table.Cell>{i+1}</Table.Cell>
                  <Table.Cell>{shareholder.firstName} {shareholder.lastName}</Table.Cell>
                  <Table.Cell>{shareholder.city}, {shareholder.state ? `${shareholder.state} ,` : ''} {shareholder.country}, {shareholder.zip}</Table.Cell>
                  <Table.Cell>{shareholder.qualifications || 'N/A'}</Table.Cell>
                  <Table.Cell>{this.transactionsPerShareholder(shareholder.ethAddresses[0].address, transactions)}</Table.Cell>
                  <Table.Cell>{this.transactionPercent(shareholder.ethAddresses[0].address, transactions)}%</Table.Cell>
                  <Table.Cell>{moment(this.lastTransactionDate(shareholder.ethAddresses[0].address, transactions)).format('LL')}</Table.Cell>
                  <Table.Cell></Table.Cell>
                </Table.Row>
            ) }
            </Table.Body>
          </Table></div>
        : <Segment>No shareholder data available</Segment>
      },
      { menuItem: 'Transactions',
        render: () =>
          transactions.length 
          ?<div className="tableContainer">
          <Table className="abTable" unstackable>
            <Table.Header className="tableHeader">
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
                  <Table.Cell>{moment(transaction.createdAt).format('LL')}</Table.Cell>
                </Table.Row>
            ) }
            </Table.Body>
          </Table></div>
          : <Segment>No transactions have been made yet</Segment>
      }
    ]

    return (
      <div className='investorsComponent'>
        <Header as='h2' className="tokenHeader">
          <Link to={`https://kovan.etherscan.io/address/${token.address}`} target='_blank' rel='noopener noreferrer'>
            {token.name}
          </Link>
        </Header>
        <div className="stats">
          <StatsCard stats={stats}/>
        </div>
        <div className="tradingToggle"> 
          <Checkbox toggle/> 
          <Modal trigger={modalTrigger}>
            <Modal.Content>
              Calendar
            </Modal.Content>
          </Modal>
        </div>
        { !loaded 
        ? <span>Loading token details...<Icon name='spinner' loading /></span> 
        : <Tab menu={{ secondary: true, pointing: true }} panes={panes}  className="tableTabs"/> }  
      </div>
    )
  }
}

export default InvestorDetailView

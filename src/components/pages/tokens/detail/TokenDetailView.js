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
const sortSrc = '../../images/icons/sortToggle.svg'

class InvestorDetailView extends Component {
  constructor(){
    super()
    this.state = {
      orderBy: ''
    }
  }
  componentDidMount () {
    this.props.loadShareholders()
    this.props.loadTransactions()
  }
  getShareholderName = (address, shareholders) => {
  const shareholder = shareholders.filter(shareholder => shareholder.ethAddresses.some(ethAddress => ethAddress.address === address))[0]
  return shareholder && shareholder.firstName
    ? `${shareholder.firstName} ${shareholder.lastName}`
    : ''
  } 
  setStats = (shareholders, transactions) => {
    return [{
            title: 'Shareholders',
            data: shareholders.length,
            icon: {
              src: userSrc,
              size: '55px'
            }
          }, {
            title: 'Total Transactions',
            data: `${transactions.length}+`,
            icon: {
              src: graphSrc,
              size: '80%'
            }
          }]
  }
  formatShareholderTableData = (shareholders, transactions) => {
      let data  = []
      shareholders.forEach((shareholder) => {
        const shareholderTransctions = transactions.filter(ta => ta.shareholderEthAddress === shareholder.ethAddresses[0].address).length
        const lastTransactionDate = transactions
        .filter(ta => ta.shareholderEthAddress === shareholder.ethAddresses[0].address)
        .map(ta => ta.createdAt)[0]
        let row = Object.assign({}, shareholder, {
          transactions: {
            quantity: shareholderTransctions,
            percent: (shareholderTransctions/transactions.length)*100,
            lastCreated : lastTransactionDate
          }
        })
        data.push(row)
      })
      return data;
    }
  render () {
    const { loaded, token, transactions, shareholders, routeTo } = this.props
    const shareholdersWithData = shareholders.filter(shareholder => shareholder.firstName)
    const stats = this.setStats(shareholdersWithData, transactions);
    const modalTrigger = <img src={calendarSrc} alt="pause trading calendar"/> 
    let shareholderTableData = () => {
      let data = this.formatShareholderTableData(shareholdersWithData, transactions);
      if(this.state.orderBy === 'quantityAsc'){
        return data.sort((a, b) => a.transactions.quantity - b.transactions.quantity)
      }
       if(this.state.orderBy === 'quantityDesc'){
        return data.sort((a, b) => b.transactions.quantity - a.transactions.quantity)
      }
      if(this.state.orderBy === 'dateAsc'){
        return data.sort((a, b) => a.transactions.lastCreated - b.transactions.lastCreated)
      }
      if(this.state.orderBy === 'dateDesc'){
        return data.sort((a, b) => b.transactions.lastCreated - a.transactions.lastCreated)
      }
      if(this.state.orderBy === 'addressAsc'){
        return data.sort((a, b) => a.country - b.country)
      }
      if(this.state.orderBy === 'addressDesc'){
        return data.sort((a, b) => b.country - a.country)
      }
      if(this.state.orderBy === 'nameAsc'){
        return data.sort((a, b) => a.firstName - b.firstName)
      }
      if(this.state.orderBy === 'nameDesc'){
        return data.sort((a, b) => b.firstName - a.firstName)
      }
      if(this.state.orderBy === ''){
        return data
      }
    };
    const panes = [
      { menuItem: 'Shareholders',
        render: () =>
         shareholdersWithData.length ? <div className="tableContainer"> 
          <Table className="abTable" unstackable>
            <Table.Header className="tableHeader">
              <Table.Row>
               <Table.HeaderCell style={{color: '#8f9bab'}}>ID</Table.HeaderCell>
                <Table.HeaderCell>Shareholder <Image src={sortSrc} className="sortButton" onClick={() => this.setState({orderBy: 'nameAsc'})}/></Table.HeaderCell>
                <Table.HeaderCell>Address <Image src={sortSrc} className="sortButton" onClick={() => this.setState({orderBy: 'addressDesc'})}/></Table.HeaderCell>
                <Table.HeaderCell>Qaulifier <Image src={sortSrc} className="sortButton" onClick={() => this.setState({orderBy: 'quantityDesc'})}/></Table.HeaderCell>
                <Table.HeaderCell>Quantity <Image src={sortSrc} className="sortButton" onClick={() => this.setState({orderBy: 'quantityAsc'})}/></Table.HeaderCell>
                <Table.HeaderCell>% of Total <Image src={sortSrc} className="sortButton" onClick={() => this.setState({orderBy: 'quantityDesc'})}/></Table.HeaderCell>
                <Table.HeaderCell>Last Transaction <Image src={sortSrc} className="sortButton" onClick={() => this.setState({orderBy: 'dateAsc'})}/></Table.HeaderCell>
                <Table.HeaderCell><Image src={downloadSrc} className="download"/></Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              { shareholderTableData().map((shareholder, i) =>
                <Table.Row key={shareholder.id} onClick={() => routeTo(`/tokens/${token.address}/shareholders/${shareholder.id}/detail`)} style={{ cursor: 'pointer' }}>
                  <Table.Cell>{i+1}</Table.Cell>
                  <Table.Cell>{shareholder.firstName} {shareholder.lastName}</Table.Cell>
                  <Table.Cell>{shareholder.country}</Table.Cell>
                  <Table.Cell>{shareholder.qualifications || 'N/A'}</Table.Cell>
                  <Table.Cell>{shareholder.transactions.quantity}</Table.Cell>
                  <Table.Cell>{shareholder.transactions.percent}%</Table.Cell>
                  <Table.Cell>{moment(shareholder.transactions.lastCreated).format('LL')}</Table.Cell>
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
          <div className="tableScrollContainer">
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
                    {this.getShareholderName(transaction.shareholderEthAddress, shareholders)}
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
          </Table>
          </div>
          </div>
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

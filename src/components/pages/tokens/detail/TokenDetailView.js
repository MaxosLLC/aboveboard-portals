import React, {Component} from 'react'
import { convertArrayToCSV } from 'convert-array-to-csv'
import moment from 'moment'
import {
  Header,
  Icon,
  Segment,
  Tab,
  Table,
  Checkbox,
  Image
} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import StatsCard from './../../../statsCard/StatsCard'
import './TokenDetail.css'

const userSrc = '../../images/icons/user.svg'
const graphSrc = '../../images/icons/graph.svg'
const downloadSrc = '../../images/icons/download.svg'
const sortUpSrc = '../../images/icons/up.svg'
const sortDownSrc = '../../images/icons/down.svg'

class InvestorDetailView extends Component {
  constructor () {
    super()
    this.state = {
      orderBy: '',
      trading: true
    }
  }
  componentDidMount () {
    this
      .props
      .loadShareholders()
    this
      .props
      .loadTransactions()
  }
  updateLocalState (stateObject) {
    this.setState(stateObject)
  }
  getShareholderName (address, shareholders) {
    const shareholder = shareholders.filter(shareholder => shareholder.ethAddresses.some(ethAddress => ethAddress.address === address))[0]
    return shareholder && shareholder.firstName
      ? `${shareholder.firstName} ${shareholder.lastName}`
      : ''
  }
  setStats (shareholders, transactions) {
    return [
      {
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
      }
    ]
  }
  formatShareholderTableData (shareholders, transactions) {
    let data = []
    shareholders.forEach((shareholder) => {
      const shareholderTransctions = transactions
        .filter(ta => ta.shareholderEthAddress === shareholder.ethAddresses[0].address)
        .length
      const lastTransactionDate = transactions
        .filter(ta => ta.shareholderEthAddress === shareholder.ethAddresses[0].address)
        .map(ta => ta.createdAt)[0]
      let row = Object.assign({}, shareholder, {
        transactions: {
          quantity: shareholderTransctions,
          percent: (shareholderTransctions / transactions.length) * 100,
          lastCreated: lastTransactionDate || 0
        }
      })
      data.push(row)
    })
    return data
  }
  shareholderTableData (shareholders, transactions) {
    let data = this.formatShareholderTableData(shareholders, transactions)
    switch (this.state.orderBy) {
      case 'quantityAsc':
        return data.sort((a, b) => a.transactions.quantity - b.transactions.quantity)
      case 'quantityDesc':
        return data.sort((a, b) => b.transactions.quantity - a.transactions.quantity)
      case 'dateAsc':
        return data.sort((a, b) => new Date(a.transactions.lastCreated) - new Date(b.transactions.lastCreated))
      case 'dateDesc':
        return data.sort((a, b) => new Date(b.transactions.lastCreated) - new Date(a.transactions.lastCreated))
      case 'addressAsc':
        return data.sort((a, b) => a.country.localeCompare(b.country))
      case 'addressDesc':
        return data.sort((a, b) => b.country.localeCompare(a.country))
      case 'qualifierAsc':
        return data.sort((a, b) => {
          a = a.qualifications
            ? a.qualifications
            : ''
          b = b.qualifications
            ? b.qualifications
            : ''
          return a.localeCompare(b)
        })
      case 'qualifierDesc':
        return data.sort((a, b) => {
          a = a.qualifications
            ? a.qualifications
            : ''
          b = b.qualifications
            ? b.qualifications
            : ''
          return b.localeCompare(a)
        })
      case 'nameAsc':
        return data.sort((a, b) => a.firstName.localeCompare(b.firstName))
      case 'nameDesc':
        return data.sort((a, b) => b.firstName.localeCompare(a.firstName))
      default:
        return data
    }
  }
  transactionsTableData (shareholders, transactions) {
    switch (this.state.orderBy) {
      case 'tQuantityAsc':
        return transactions.sort((a, b) => a.tokens - b.tokens)
      case 'tQuantityDesc':
        return transactions.sort((a, b) => b.tokens - a.tokens)
      case 'hashAsc':
        return transactions.sort((a, b) => a.transactionHash - b.transactionHash)
      case 'hashDesc':
        return transactions.sort((a, b) => b.transactionHash - a.transactionHash)
      case 'tDateAsc':
        return transactions.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      case 'tDateDesc':
        return transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      case 'tAddressAsc':
        return transactions.sort((a, b) => a.contractAddress.localeCompare(b.contractAddress))
      case 'tAddressDesc':
        return transactions.sort((a, b) => b.contractAddress.localeCompare(a.contractAddress))
      case 'tNameAsc':
        return transactions.sort((a, b) => {
          a = this.getShareholderName(a.shareholderEthAddress, shareholders)
          b = this.getShareholderName(b.shareholderEthAddress, shareholders)
          return a.localeCompare(b)
        })
      case 'tNameDesc':
        return transactions.sort((a, b) => {
          a = this.getShareholderName(a.shareholderEthAddress, shareholders)
          b = this.getShareholderName(b.shareholderEthAddress, shareholders)
          return b.localeCompare(a)
        })
      default:
        return transactions
    }
  }
  getCsvData (src) {
      // TODO: needs pre-formatted or joined data from DB - would help render shareholder data faster
      // convertArrayToCSV won't convert nested objects
    if (src === 'shareholders') {
      return `data:application/octet-stream,${convertArrayToCSV(this.formatShareholderTableData(this.props.shareholders, this.props.transactions))}`
    }
    if (src === 'transactions') {
      return `data:application/octet-stream,${convertArrayToCSV(this.props.transactions)}`
    }
  }
  render () {
    const {loaded, token, transactions, shareholders, routeTo} = this.props
    const shareholdersWithData = shareholders.filter(shareholder => shareholder.firstName)
    const stats = this.setStats(shareholdersWithData, transactions)
    const panes = [
      {
        menuItem: 'Shareholders',
        render: () => shareholdersWithData.length
          ? <div className='tableContainer'>
            <Table className='abTable' unstackable>
              <Table.Header className='tableHeader'>
                <Table.Row>
                  <Table.HeaderCell
                    style={{
                      color: '#8f9bab'
                    }}>ID</Table.HeaderCell>
                  <Table.HeaderCell>Shareholder
                      <span className='sortButtons'>
                        <Image
                          src={sortUpSrc}
                          onClick={() => this.updateLocalState({orderBy: 'nameAsc'})} />
                        <Image
                          src={sortDownSrc}
                          onClick={() => this.updateLocalState({orderBy: 'nameDesc'})} />
                      </span>
                  </Table.HeaderCell>
                  <Table.HeaderCell>Address
                      <span className='sortButtons'>
                        <Image
                          src={sortUpSrc}
                          onClick={() => this.updateLocalState({orderBy: 'addressAsc'})} />
                        <Image
                          src={sortDownSrc}
                          onClick={() => this.updateLocalState({orderBy: 'addressDesc'})} />
                      </span>
                  </Table.HeaderCell>
                  <Table.HeaderCell>Qaulifier
                      <span className='sortButtons'>
                        <Image
                          src={sortUpSrc}
                          onClick={() => this.updateLocalState({orderBy: 'qualifierAsc'})} />
                        <Image
                          src={sortDownSrc}
                          onClick={() => this.updateLocalState({orderBy: 'qualifierDesc'})} />
                      </span>
                  </Table.HeaderCell>
                  <Table.HeaderCell>Quantity
                      <span className='sortButtons'>
                        <Image
                          src={sortUpSrc}
                          onClick={() => this.updateLocalState({orderBy: 'quantityAsc'})} />
                        <Image
                          src={sortDownSrc}
                          onClick={() => this.updateLocalState({orderBy: 'quantityDesc'})} />
                      </span>
                  </Table.HeaderCell>
                  <Table.HeaderCell>% of Total
                      <span className='sortButtons'>
                        <Image
                          src={sortUpSrc}
                          onClick={() => this.updateLocalState({orderBy: 'quantityAsc'})} />
                        <Image
                          src={sortDownSrc}
                          onClick={() => this.updateLocalState({orderBy: 'quantityDesc'})} />
                      </span>
                  </Table.HeaderCell>
                  <Table.HeaderCell>Last Transaction
                      <span className='sortButtons'>
                        <Image
                          src={sortUpSrc}
                          onClick={() => this.updateLocalState({orderBy: 'dateAsc'})} />
                        <Image
                          src={sortDownSrc}
                          onClick={() => this.updateLocalState({orderBy: 'dateDesc'})} />
                      </span>
                  </Table.HeaderCell>
                  <Table.HeaderCell><a href={this.getCsvData('shareholders')} download='shareholders.csv'><Image src={downloadSrc} className='download' /></a></Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {this
                    .shareholderTableData(shareholdersWithData, transactions)
                    .map((shareholder, i) => <Table.Row
                      key={shareholder.id}
                      onClick={() => routeTo(`/tokens/${token.address}/shareholders/${shareholder.id}/detail`)}
                      style={{
                        cursor: 'pointer'
                      }}>
                      <Table.Cell>{i + 1}</Table.Cell>
                      <Table.Cell>{shareholder.firstName} {shareholder.lastName}</Table.Cell>
                      <Table.Cell>{shareholder.country}</Table.Cell>
                      <Table.Cell>{shareholder.qualifications || 'N/A'}</Table.Cell>
                      <Table.Cell>{shareholder.transactions.quantity}</Table.Cell>
                      <Table.Cell>{shareholder.transactions.percent}%</Table.Cell>
                      <Table.Cell>{shareholder.transactions.lastCreated
                          ? moment(shareholder.transactions.lastCreated).format('LL')
                          : 'N/A'}</Table.Cell>
                      <Table.Cell />
                    </Table.Row>)}
              </Table.Body>
            </Table>
          </div>
          : <Segment>No shareholder data available</Segment>
      }, {
        menuItem: 'Transactions',
        render: () => transactions.length
          ? <div className='tableContainer'>
            <div className='tableScrollContainer'>
              <Table className='abTable' unstackable>
                <Table.Header className='tableHeader'>
                  <Table.Row>
                    <Table.HeaderCell>Hash
                        <span className='sortButtons'>
                          <Image
                            src={sortUpSrc}
                            onClick={() => this.updateLocalState({orderBy: 'hashAsc'})} />
                          <Image
                            src={sortDownSrc}
                            onClick={() => this.updateLocalState({orderBy: 'hashDesc'})} />
                        </span>
                    </Table.HeaderCell>
                    <Table.HeaderCell>Shareholder
                        <span className='sortButtons'>
                          <Image
                            src={sortUpSrc}
                            onClick={() => this.updateLocalState({orderBy: 'tNameAsc'})} />
                          <Image
                            src={sortDownSrc}
                            onClick={() => this.updateLocalState({orderBy: 'tNameDesc'})} />
                        </span>
                    </Table.HeaderCell>
                    <Table.HeaderCell>Address
                        <span className='sortButtons'>
                          <Image
                            src={sortUpSrc}
                            onClick={() => this.updateLocalState({orderBy: 'tAddressAsc'})} />
                          <Image
                            src={sortDownSrc}
                            onClick={() => this.updateLocalState({orderBy: 'tAddressDesc'})} />
                        </span>
                    </Table.HeaderCell>
                    <Table.HeaderCell>Quantity
                        <span className='sortButtons'>
                          <Image
                            src={sortUpSrc}
                            onClick={() => this.updateLocalState({orderBy: 'tQuantityAsc'})} />
                          <Image
                            src={sortDownSrc}
                            onClick={() => this.updateLocalState({orderBy: 'tQuantityDesc'})} />
                        </span>
                    </Table.HeaderCell>
                    <Table.HeaderCell>Date
                        <span className='sortButtons'>
                          <Image
                            src={sortUpSrc}
                            onClick={() => this.updateLocalState({orderBy: 'tDateAsc'})} />
                          <Image
                            src={sortDownSrc}
                            onClick={() => this.updateLocalState({orderBy: 'tDateDesc'})} />
                        </span>
                    </Table.HeaderCell>
                    <Table.HeaderCell><a href={this.getCsvData('transactions')} download='transactions.csv'><Image src={downloadSrc} className='download' /></a></Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {this
                      .transactionsTableData(shareholdersWithData, transactions)
                      .map(transaction => <Table.Row key={transaction.id}>
                        <Table.Cell>
                          <Link
                            to={`https://kovan.etherscan.io/tx/${transaction.transactionHash}`}
                            target='_blank'
                            rel='noopener noreferrer'>
                            {transaction
                              .transactionHash
                              .substr(0, 4)}...{transaction
                              .transactionHash
                              .substr(transaction.transactionHash.length - 4, 4)}
                          </Link>
                        </Table.Cell>
                        <Table.Cell>
                          {this.getShareholderName(transaction.shareholderEthAddress, shareholders)
                            ? this.getShareholderName(transaction.shareholderEthAddress, shareholders)
                            : 'N/A'}
                        </Table.Cell>
                        <Table.Cell>
                          <Link
                            to={`https://kovan.etherscan.io/address/${transaction.shareholderEthAddress}`}
                            target='_blank'
                            rel='noopener noreferrer'>
                            {transaction
                              .shareholderEthAddress
                              .substr(0, 4)}...{transaction
                              .shareholderEthAddress
                              .substr(transaction.shareholderEthAddress.length - 4, 4)}
                          </Link>
                        </Table.Cell>
                        <Table.Cell>{transaction.tokens}</Table.Cell>
                        <Table.Cell>{moment(transaction.createdAt).format('LL')}</Table.Cell>
                        <Table.Cell />
                      </Table.Row>)}
                </Table.Body>
              </Table>
            </div>
          </div>
          : <Segment>No transactions have been made yet</Segment>
      }
    ]
    return (
      <div className='investorsComponent'>
        <Header as='h2' className='tokenHeader'>
          <Link
            to={`https://kovan.etherscan.io/address/${token.address}`}
            target='_blank'
            rel='noopener noreferrer'>
            {token.name}
          </Link>
        </Header>
        <div className='stats'>
          <StatsCard stats={stats} />
        </div>
        <div className='tradingToggle'>
          <span>
            <strong>Trading: </strong>
            {this.state.trading
              ? 'Active'
              : 'Paused'}</span>
          <Checkbox
            toggle
            onClick={() => this.updateLocalState({
              trading: !this.state.trading
            })}
            checked={this.state.trading} />
        </div>
        {!loaded
          ? <span>Loading token details...<Icon name='spinner' loading /></span>
          : <Tab
            menu={{
              secondary: true,
              pointing: true
            }}
            panes={panes}
            className='tableTabs' />}
      </div>
    )
  }
}

export default InvestorDetailView

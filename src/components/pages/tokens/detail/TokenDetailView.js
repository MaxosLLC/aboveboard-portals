import React, {Component} from 'react'
import moment from 'moment'
import { Checkbox, Header, Icon, Image, Segment, Tab, Table } from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import StatsCard from 'components/statsCard/StatsCard'
import './TokenDetail.css'

const iconsPath = '../../images/icons'
const userSrc = `${iconsPath}/user.svg`
const graphSrc = `${iconsPath}/graph.svg`
const downloadSrc = `${iconsPath}/download.svg`
const sortUpSrc = `${iconsPath}/up.svg`
const sortDownSrc = `${iconsPath}/down.svg`

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
    this
      .props
      .loadLocalToken()
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
    const { address, tokensTransferred } = this.props.localToken

    return shareholders.map(shareholder => {
      const shareholderTransctions = transactions
        .filter(({ shareholderEthAddress }) => shareholderEthAddress === shareholder.ethAddresses[0].address)
      const lastCreated = (shareholderTransctions[0] || {}).createdAt || 0

      const quantity = shareholder.ethAddresses.reduce((result, ethAddress) => {
        if (result) { return result }

        if (Array.isArray(ethAddress.issues)) {
          const issues = ethAddress.issues.filter(issue => issue.address === address)

          if (issues && issues.length) {
            return issues[0].tokens || 0
          }
        }

        return result
      }, 0)
      const percent = (quantity / tokensTransferred * 100).toFixed(1)

      return Object.assign({}, shareholder, {
        transactions: {
          quantity,
          percent,
          lastCreated
        }
      })
    })
  }
  shareholderTableData (shareholders, transactions) {
    const data = this.formatShareholderTableData(shareholders, transactions)

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
    transactions = transactions.map(transaction => { // TODO: remove once tx data is cleared and stable
      if (!transaction.fromEthAddress) {
        transaction.fromEthAddress = '0x51595ee792a82607071109b61fff7925585c0e4b'
      }

      return transaction
    })
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
      case 'tFrom':
        return transactions.sort((a, b) => b.fromEthAddress.localeCompare(a.fromEthAddress))
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
      return `data:application/octet-stream,${this.formatShareholderTableData(this.props.shareholders, this.props.transactions)}` // TODO: convert from array to CSV
    }
    if (src === 'transactions') {
      return `data:application/octet-stream,${this.props.transactions}` // TODO: convert from array to CSV
    }
  }
  render () {
    const {loaded, token, transactions, shareholders, routeTo} = this.props
    const shareholdersWithData = shareholders.filter(shareholder => shareholder.firstName)
    const stats = this.setStats(shareholdersWithData, transactions)

    const shareholderHeaders = [
      { name: 'Shareholder', alias: 'name' },
      { name: 'Address' },
      { name: 'Qualifier' },
      { name: 'Quantity' },
      { name: '% of Total', alias: 'quantity' },
      { name: 'Last Transaction', alias: 'date' }
    ]

    const transactionsHeaders = [
      { name: 'Hash' },
      { name: 'From', alias: 'tFrom' },
      { name: 'Shareholder', alias: 'tName' },
      { name: 'Address', alias: 'tAddress' },
      { name: 'Quantity', alias: 'tQuantity' },
      { name: 'Date', alias: 'tDate' }
    ]

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
                  { shareholderHeaders.map((shareholderHeader, i) =>
                    <Table.HeaderCell key={`${shareholderHeader.name}${i}`}>{shareholderHeader.name}
                      <span className='sortButtons'>
                        <Image
                          src={sortUpSrc}
                          onClick={() => this.updateLocalState({orderBy: `${shareholderHeader.alias || shareholderHeader.name.toLowerCase()}Asc`})} />
                        <Image
                          src={sortDownSrc}
                          onClick={() => this.updateLocalState({orderBy: `${shareholderHeader.alias || shareholderHeader.name.toLowerCase()}Desc`})} />
                      </span>
                    </Table.HeaderCell>
                  ) }
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
                    { transactionsHeaders.map((transactionsHeader, i) =>
                      <Table.HeaderCell key={`${transactionsHeader.name}${i}`}>{transactionsHeader.name}
                        <span className='sortButtons'>
                          <Image
                            src={sortUpSrc}
                            onClick={() => this.updateLocalState({orderBy: `${transactionsHeader.alias || transactionsHeader.name.toLowerCase()}Asc`})} />
                          <Image
                            src={sortDownSrc}
                            onClick={() => this.updateLocalState({orderBy: `${transactionsHeader.alias || transactionsHeader.name.toLowerCase()}Desc`})} />
                        </span>
                      </Table.HeaderCell>
                    ) }
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
                          <Link
                            to={`https://kovan.etherscan.io/address/${transaction.fromEthAddress}`}
                            target='_blank'
                            rel='noopener noreferrer'>
                            {transaction
                              .fromEthAddress
                              .substr(0, 4)}...{transaction
                              .fromEthAddress
                              .substr(transaction.fromEthAddress.length - 4, 4)}
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
          { loaded
            ? <StatsCard stats={stats} />
            : ''
          }
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

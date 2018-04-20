import React, {Component} from 'react'
import moment from 'moment'
import { Checkbox, Header, Icon, Image, Input, Segment, Tab, Table } from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import StatsCard from 'components/statsCard/StatsCard'
import './TokenDetail.css'

const iconsPath = '../../images/icons'
const userSrc = `${iconsPath}/user.svg`
const graphSrc = `${iconsPath}/graph.svg`
const downloadSrc = `${iconsPath}/download.svg`
const sortUpSrc = `${iconsPath}/up.svg`
const sortDownSrc = `${iconsPath}/down.svg`

const convertToCSVSafeObject = obj => {
  return Object.keys(obj).reduce((csvObj, key) => {
    if (key === 'ethAddresses') {
      csvObj.ethAddresses = (obj[key] || []).map(({ address }) => address).join('-')
    } else {
      const value = (obj[key] + '').replace(/,/, ' ')
      csvObj[key] = value
    }

    return csvObj
  }, {})
}

const processDownload = (type, href) => {
  const tempAnchor = document.createElement('a')
  tempAnchor.download = `${type}s.csv`
  tempAnchor.href = href
  tempAnchor.onclick = e => {
    const that = this
    setTimeout(() => {
      window.URL.revokeObjectURL(that.href)
    }, 1500)
  }

  tempAnchor.click()
  tempAnchor.remove()
}

class InvestorDetailView extends Component {
  constructor () {
    super()
    this.state = {
      orderBy: '',
      trading: true,
      activeIndex: 0,
      sort: {
        transactions: { createdAt: -1 },
        shareholders: { createdAt: -1 }
      },
      page: {
        transactions: 0,
        shareholders: 0
      },
      search: {
        transactions: '',
        shareholders: ''
      }
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
  downloadCsvData (type) {
    if (type === 'shareholder') {
      this.props.loadAll('shareholder')
        .then(shareholders => {
          const headers = 'ID, First Name, Last Name, Email, Phone, Address Line1, City, State, Country, Zip, Ethereum Addresses\n'
          const csvSafeData = shareholders.map(convertToCSVSafeObject)

          const csv = csvSafeData.reduce((result, shareholder) => {
            const { id, firstName, lastName, email, phone, addressLine1, city, state, country, zip, ethAddresses } = shareholder
            return `${result}${id},${firstName},${lastName},${email},${phone},${addressLine1},${city},${state},${country},${zip},${ethAddresses}\n`
          }, headers)

          return processDownload(type, `data:text/csv;charset=utf-8,${csv}`)
        })
    }

    if (type === 'transaction') {
      this.props.loadAll('transaction')
        .then(transactions => {
          const headers = 'ID, Transaction Hash, Contract Address, Shareholder Ethereum Address, From Ethereum Address, Tokens, Date, Timestamp\n'
          const csvSafeData = transactions.map(convertToCSVSafeObject)

          const csv = csvSafeData.reduce((result, transaction) => {
            const { id, transactionHash, contractAddress, shareholderEthAddress, fromEthAddress, tokens, createdAt } = transaction
            return `${result}${id},${transactionHash},${contractAddress},${shareholderEthAddress},${fromEthAddress},${tokens},${moment(createdAt).format('MMMM Do YYYY - h:mm:ss a')},${(new Date(createdAt)).getTime()}\n`
          }, headers)

          return processDownload(type, `data:text/csv;charset=utf-8,${csv}`)
        })
    }
  }
  render () {
    const { loaded, token, transactions, shareholders, routeTo } = this.props
    const { activeIndex, page, sort, search } = this.state
    const shareholdersWithData = shareholders.filter(shareholder => shareholder.firstName)
    const stats = this.setStats(shareholdersWithData, transactions)

    const handleSearch = (e, { value }) => {
      this.setState({ search: { [activeIndex === 0 ? 'shareholders' : 'transactions']: value } })
      activeIndex === 0
        ? this.props.loadShareholders(sort.shareholders, page.shareholders, value)
        : this.props.loadTransactions(sort.transactions, page.transactions, value)
    }

    const shareholderHeaders = [
      { name: 'Shareholder', sortOption: 'lastName' },
      { name: 'Address', sortOption: 'country' },
      { name: 'Qualifier', sortOption: 'qualifier' },
      { name: 'Quantity', sortOption: 'ethaddress.issues.tokens' },
      { name: '% of Total', sortOption: 'ethaddress.issues.tokens' },
      { name: 'Last Transaction', sortOption: 'updatedAt' }
    ]

    const transactionsHeaders = [
      { name: 'Hash', sortOption: 'transactionHash' },
      { name: 'From', sortOption: 'fromEthAddress' },
      { name: 'Shareholder', sortOption: 'shareholderEthAddress' },
      { name: 'Address', sortOption: 'country' },
      { name: 'Quantity', sortOption: 'tokens' },
      { name: 'Date', sortOption: 'createdAt' }
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
                          onClick={() => { this.setState({ sort: { shareholders: { [shareholderHeader.sortOption]: 1 } } }); this.props.loadShareholders({ [shareholderHeader.sortOption]: 1 }, page.shareholders, search.shareholders) }} />
                        <Image
                          src={sortDownSrc}
                          onClick={() => { this.setState({ sort: { shareholders: { [shareholderHeader.sortOption]: -1 } } }); this.props.loadShareholders({ [shareholderHeader.sortOption]: -1 }, page.shareholders, search.shareholders) }} />
                      </span>
                    </Table.HeaderCell>
                  ) }
                  <Table.HeaderCell><a onClick={() => this.downloadCsvData('shareholder')}><Image src={downloadSrc} className='download' /></a></Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {this
                    .formatShareholderTableData(shareholdersWithData, transactions)
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
                            onClick={() => { this.setState({ sort: { transactions: { [transactionsHeader.sortOption]: 1 } } }); this.props.loadTransactions({ [transactionsHeader.sortOption]: 1 }, page.transactions, search.transactions) }} />
                          <Image
                            src={sortDownSrc}
                            onClick={() => { this.setState({ sort: { transactions: { [transactionsHeader.sortOption]: -1 } } }); this.props.loadTransactions({ [transactionsHeader.sortOption]: -1 }, page.transactions, search.transactions) }} />
                        </span>
                      </Table.HeaderCell>
                    ) }
                    <Table.HeaderCell><a onClick={() => this.downloadCsvData('transaction')}><Image src={downloadSrc} className='download' /></a></Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {transactions
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
        <div>
          <Input loading={!loaded} icon={activeIndex === 0 ? 'user' : 'dollar'} placeholder='Search...' onChange={handleSearch} />
        </div>
        <br />
        {!loaded
          ? <span>Loading token details...<Icon name='spinner' loading /></span>
          : <Tab
            activeIndex={activeIndex}
            menu={{
              secondary: true,
              pointing: true
            }}
            panes={panes}
            onTabChange={(e, { activeIndex }) => { this.setState({ activeIndex }) }}
            className='tableTabs' />}
      </div>
    )
  }
}

export default InvestorDetailView

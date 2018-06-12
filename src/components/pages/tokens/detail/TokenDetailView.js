import React, {Component} from 'react'
import { join } from 'bluebird'
import moment from 'moment'
import { Checkbox, Header, Icon, Image, Input, Pagination, Segment, Tab, Table } from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import StatsCard from 'components/statsCard/StatsCard'
import './TokenDetail.css'

const iconsPath = '/images/icons'
const userSrc = `${iconsPath}/user.svg`
const graphSrc = `${iconsPath}/graph.svg`
const downloadSrc = `${iconsPath}/download.svg`
const sortUpSrc = `${iconsPath}/up.svg`
const sortDownSrc = `${iconsPath}/down.svg`

const convertToCSVSafeObject = tokenAddress => obj => {
  return Object.keys(obj).reduce((csvObj, key) => {
    if (key === 'ethAddresses') {
      csvObj.ethAddresses = (obj[key] || []).map(({ address }) => address).join('-')
      csvObj.balance = (obj[key] || []).reduce((result, ethAddress) => {
        if (result) { return result }

        const issue = (ethAddress.issues || []).filter(({ address }) => address === tokenAddress)[0]

        return issue && issue.tokens ? issue.tokens : 0
      }, 0)
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
      activeIndex: 0,
      totalShareholders: 0,
      totalTransactions: 0,
      locked: undefined
    }
  }
  componentDidMount () {
    join(
      this.props.loadShareholders(this.props.currentUser),
      this.props.loadTransactions(),
      ({ total: totalShareholders }, { total: totalTransactions }) => {
        this.setState({ totalShareholders, totalTransactions })
      })

    this
      .props
      .loadLocalToken()
      .then(() => {
        this.props.getTokenTrading(this.props.localToken.address)
          .then(locked => this.setState({ locked }))
      })
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
        data: shareholders,
        icon: {
          src: userSrc,
          size: '55px'
        }
      }, {
        title: 'Total Transactions',
        data: `${transactions}+`,
        icon: {
          src: graphSrc,
          size: '80%'
        }
      }
    ]
  }
  formatShareholderTableData (shareholders, transactions) {
    const { address } = this.props.localToken

    const quantityByShareholderId = {}

    const tokensTransferred = shareholders.reduce((result1, shareholder) => {
      const quantity = shareholder.ethAddresses.reduce((result2, ethAddress) => {
        if (result2) { return result2 }

        if (Array.isArray(ethAddress.issues)) {
          const issues = ethAddress.issues.filter(issue => issue.address === address)

          if (issues && issues.length) {
            return result2 + (issues[0].tokens || 0)
          }
        }

        return result2
      }, 0)

      quantityByShareholderId[shareholder.id] = quantity

      return result1 + quantity
    }, 0)

    return shareholders.map(shareholder => {
      const shareholderTransctions = transactions
        .filter(({ shareholderEthAddress }) => shareholder.ethAddresses.some(({ address }) => shareholderEthAddress === address))
      const lastCreated = (shareholderTransctions[0] || {}).createdAt || 0

      const quantity = quantityByShareholderId[shareholder.id]
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
          const headers = 'ID, First Name, Last Name, Email, Phone, Address, City, State, Country, Zip, Ethereum Addresses, Balance\n'
          const csvSafeData = shareholders.map(convertToCSVSafeObject(this.props.token.address))

          const csv = csvSafeData.reduce((result, shareholder) => {
            const { id, firstName, lastName, email, phone, addressLine1, addressLine2, city, state, country, zip, ethAddresses, balance } = shareholder
            return `${result}${id},${firstName},${lastName},${email},${phone},${addressLine1}${addressLine2 ? ' ' + addressLine2 : ''},${city},${state},${country},${zip},${ethAddresses},${balance}\n`
          }, headers)

          return processDownload(type, `data:text/csv;charset=utf-8,${encodeURI(csv)}`)
        })
    }

    if (type === 'transaction') {
      this.props.loadAll('transaction')
        .then(transactions => {
          const headers = 'ID, Transaction Hash, Contract Address, Shareholder Ethereum Address, From Ethereum Address, Tokens, Date, Timestamp\n'
          const csvSafeData = transactions.map(convertToCSVSafeObject(this.props.token.address))

          const csv = csvSafeData.reduce((result, transaction) => {
            const { id, transactionHash, contractAddress, shareholderEthAddress, fromEthAddress, tokens, createdAt } = transaction
            return `${result}${id},${transactionHash},${contractAddress},${shareholderEthAddress},${fromEthAddress},${tokens},${moment(createdAt).format('MMMM Do YYYY - h:mm:ss a')},${(new Date(createdAt)).getTime()}\n`
          }, headers)

          return processDownload(type, `data:text/csv;charset=utf-8,${encodeURI(csv)}`)
        })
    }
  }
  render () {
    const { loaded, currentUser, token, localToken, transactions, shareholders, queryResult, routeTo, page, search, setPage, setSort, setSearch, setTokenTrading, totalTransactions } = this.props
    const { activeIndex, locked, totalShareholders } = this.state
    const shareholdersWithData = shareholders.filter(shareholder => shareholder.firstName)
    const stats = this.setStats(totalShareholders, totalTransactions)

    const handleSearch = (e, { value }) => {
      setSearch(activeIndex === 0 ? 'shareholders' : 'transactions', value)
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

    const TableRow = Table.Row
    const TableCell = Table.Cell

    const panes = [
      {
        menuItem: 'Shareholders',
        render: () => shareholdersWithData.length
          ? <div className='tableContainer'>
            <Table className='abTable' unstackable>
              <Table.Header className='tableHeader'>
                <TableRow>
                  <Table.HeaderCell
                    style={{
                      color: '#8f9bab'
                    }}>ID</Table.HeaderCell>
                  { shareholderHeaders.map((shareholderHeader, i) =>
                    <Table.HeaderCell key={`${shareholderHeader.name}${i}`}>{shareholderHeader.name}
                      <span className='sortButtons'>
                        <Image
                          src={sortUpSrc}
                          onClick={() => { setSort(currentUser.role === 'issuer' ? 'shareholders' : 'investors', { [shareholderHeader.sortOption]: 1 }) }} />
                        <Image
                          src={sortDownSrc}
                          onClick={() => { setSort(currentUser.role === 'issuer' ? 'shareholders' : 'investors', { [shareholderHeader.sortOption]: -1 }) }} />
                      </span>
                    </Table.HeaderCell>
                  ) }
                  <Table.HeaderCell><a onClick={() => this.downloadCsvData('shareholder')} style={{ cursor: 'pointer' }}><Image src={downloadSrc} className='download' /></a></Table.HeaderCell>
                </TableRow>
              </Table.Header>
              <Table.Body>
                {this
                  .formatShareholderTableData(shareholdersWithData, transactions)
                  .map((shareholder, i) => <TableRow
                    name='shareholders'
                    key={shareholder.id}
                    onClick={() => routeTo(`/tokens/${token.address}/shareholders/${shareholder.id}/detail`)}
                    style={{ cursor: 'pointer' }}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{shareholder.firstName} {shareholder.lastName}</TableCell>
                    <TableCell>{shareholder.country}</TableCell>
                    <TableCell>{shareholder.qualifications || 'N/A'}</TableCell>
                    <TableCell>{shareholder.transactions.quantity}</TableCell>
                    <TableCell>{shareholder.transactions.percent}%</TableCell>
                    <TableCell>{shareholder.transactions.lastCreated
                      ? moment(shareholder.transactions.lastCreated).format('LL')
                      : 'N/A'}</TableCell>
                    <TableCell />
                  </TableRow>)}
              </Table.Body>

              { queryResult.shareholders.total > queryResult.shareholders.limit &&
                <Table.Footer>
                  <TableRow>
                    <Table.HeaderCell floated='right' colSpan='8'>
                      <Pagination
                        floated='right'
                        activePage={page.shareholders + 1}
                        totalPages={
                          queryResult.shareholders
                            ? Math.floor(
                                queryResult.shareholders.total /
                                  queryResult.shareholders.limit
                              ) + 1
                            : 1
                        }
                        onPageChange={(e, { activePage }) => setPage(currentUser.role === 'issuer' ? 'shareholders' : 'investors', activePage - 1)}
                      />
                    </Table.HeaderCell>
                  </TableRow>
                </Table.Footer>
              }
            </Table>
          </div>
          : <Segment>{ search.shareholders ? 'No shareholders match your search criteria' : 'No shareholder data available' }</Segment>
      }, {
        menuItem: 'Transactions',
        render: () => transactions.length
          ? <div className='tableContainer'>
            <div className='tableScrollContainer'>
              <Table className='abTable' unstackable>
                <Table.Header className='tableHeader'>
                  <TableRow>
                    { transactionsHeaders.map((transactionsHeader, i) =>
                      <Table.HeaderCell key={`${transactionsHeader.name}${i}`}>{transactionsHeader.name}
                        <span className='sortButtons'>
                          <Image
                            src={sortUpSrc}
                            onClick={() => { setSort('transactions', { [transactionsHeader.sortOption]: 1 }) }} />
                          <Image
                            src={sortDownSrc}
                            onClick={() => { setSort('transactions', { [transactionsHeader.sortOption]: -1 }) }} />
                        </span>
                      </Table.HeaderCell>
                    ) }
                    <Table.HeaderCell><a onClick={() => this.downloadCsvData('transaction')} style={{ cursor: 'pointer' }}><Image src={downloadSrc} className='download' /></a></Table.HeaderCell>
                  </TableRow>
                </Table.Header>

                <Table.Body>
                  {transactions
                      .map(transaction => <TableRow key={transaction.id}>
                        <TableCell>
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
                        </TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell>
                          {this.getShareholderName(transaction.shareholderEthAddress, shareholders)
                            ? this.getShareholderName(transaction.shareholderEthAddress, shareholders)
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell>{transaction.tokens}</TableCell>
                        <TableCell>{moment(transaction.createdAt).format('LL')}</TableCell>
                        <TableCell />
                      </TableRow>)}
                </Table.Body>

                <Table.Footer>
                  <TableRow>
                    <Table.HeaderCell floated='right' colSpan='8'>
                      <Pagination
                        floated='right'
                        activePage={page.transactions + 1}
                        totalPages={
                          queryResult.transactions
                            ? Math.floor(
                                queryResult.transactions.total /
                                  queryResult.transactions.limit
                              ) + 1
                            : 1
                        }
                        onPageChange={(e, { activePage }) => setPage('transactions', activePage - 1)}
                      />
                    </Table.HeaderCell>
                  </TableRow>
                </Table.Footer>
              </Table>
            </div>
          </div>
          : <Segment>{ search.transactions ? 'No transactions match your search criteria' : 'No transactions have been made yet' }</Segment>
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
        { locked !== undefined &&
          <div className='tradingToggle'>
            <span>
              <strong>Trading: </strong>
              {locked ? 'Active' : 'Paused'}
            </span>
            <Checkbox
              toggle
              onChange={(e, { locked }) => setTokenTrading(token.address, locked).then(() => this.setState({ locked })) }
              checked={locked} />
          </div>
        }
        <div>
          <Input loading={!loaded} icon={activeIndex === 0 ? 'user' : 'dollar'} placeholder='Search...' onChange={handleSearch} value={activeIndex === 0 ? search.shareholders : search.transactions} />
        </div>
        <br />
        {!loaded
          ? <span>Loading token details...<Icon name='spinner' loading /></span>
          : <Tab
            activeIndex={activeIndex}
            menu={{ secondary: true, pointing: true }}
            panes={panes}
            onTabChange={(e, { activeIndex }) => { setSearch(activeIndex === 0 ? 'shareholders' : 'transactions', ''); this.setState({ activeIndex }) }}
            className='tableTabs' />}
      </div>
    )
  }
}

export default InvestorDetailView

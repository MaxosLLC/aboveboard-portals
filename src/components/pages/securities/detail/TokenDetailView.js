import React, {Component} from 'react'
import moment from 'moment'
import { all } from 'bluebird'
import { Link } from 'react-router-dom'
import { Button, Checkbox, Grid, Header, Icon, Image, Input, Label, Pagination, Segment, Tab, Table } from 'semantic-ui-react'
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
      locked: undefined
    }
  }
  async componentDidMount () {
    if (this.props.currentToken === 'none') { return }

    await all([
      this.props.loadShareholders(this.props.currentUser),
      this.props.loadTransactions()
    ])

    await this.props.loadLocalToken()
    await this.props.setCurrentToken(this.props.localToken.address)
    const locked = await this.props.getTokenTrading(this.props.localToken.address)
    this.setState({ locked })
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
    if (type === 'investor') {
      this.props.loadAll(type)
        .then(shareholders => {
          const headers = '"ID", "First Name", "Last Name", "Email", "Phone", "Address", "City", "State", "Country", "Zip", "Ethereum Addresses", "Balance"\n'
          const csvSafeData = shareholders.map(convertToCSVSafeObject(this.props.localToken.address))

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
          const headers = '"ID", "Transaction Hash", "Contract Address", "Shareholder Ethereum Address", "From Ethereum Address", "Tokens", "Date"\n'
          const csvSafeData = transactions.map(convertToCSVSafeObject(this.props.localToken.address))

          const csv = csvSafeData.reduce((result, transaction) => {
            const { id, transactionHash, contractAddress, shareholderEthAddress, fromEthAddress, tokens, createdAt } = transaction
            return `${result}${id},${transactionHash},${contractAddress},${shareholderEthAddress},${fromEthAddress},${tokens},"${moment(createdAt).format('MMMM Do YYYY - h:mm:ss a')}"\n`
          }, headers)

          return processDownload(type, `data:text/csv;charset=utf-8,${encodeURI(csv)}`)
        })
    }
  }
  render () {
    const { loaded, currentToken, localToken, transactions, shareholders, queryResult, routeTo, page, search, setPage, setSort, setSearch, setTokenTrading, totalTransactions, totalShareholders } = this.props
    const { activeIndex, locked } = this.state
    const shareholdersWithData = shareholders.map(shareholder => {
      if (shareholder.firstName) { return shareholder }

      return Object.assign({}, shareholder, { firstName: 'No', lastName: 'Data' })
    })
    const stats = this.setStats(totalShareholders, totalTransactions)

    const handleSearch = (e, { value }) => {
      setSearch(activeIndex === 0 ? 'investors' : 'transactions', value)
    }

    const handleSetTradingLock = async (e, { checked: active }) => {
      await setTokenTrading(localToken.address, active)
      this.setState({ locked: !active })
    }

    const shareholderHeaders = [
      { name: 'Shareholder', sortOption: 'lastName' },
      { name: 'Address', sortOption: 'country' },
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
                        { shareholderHeader.name !== 'Quantity' && shareholderHeader.name !== '% of Total' && <Image
                          src={sortUpSrc}
                          onClick={() => { setSort('investors', { [shareholderHeader.sortOption]: 1 }) }} /> }
                        { shareholderHeader.name !== 'Quantity' && shareholderHeader.name !== '% of Total' && <Image
                          src={sortDownSrc}
                          onClick={() => { setSort('investors', { [shareholderHeader.sortOption]: -1 }) }} /> }
                      </span>
                    </Table.HeaderCell>
                  ) }
                  <Table.HeaderCell><a onClick={() => this.downloadCsvData('investor')} style={{ cursor: 'pointer' }}><Image src={downloadSrc} className='download' /></a></Table.HeaderCell>
                </TableRow>
              </Table.Header>
              <Table.Body>
                {this
                  .formatShareholderTableData(shareholdersWithData, transactions)
                  .map((shareholder, i) => <TableRow
                    name='shareholders'
                    key={shareholder.id}
                    onClick={() => routeTo(`/securities/${localToken.address}/shareholders/${shareholder.id}/detail`)}
                    style={{ cursor: 'pointer' }}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{shareholder.firstName} {shareholder.lastName}</TableCell>
                    <TableCell>{shareholder.country}</TableCell>
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
                        onPageChange={(e, { activePage }) => setPage('investors', activePage - 1)}
                      />
                    </Table.HeaderCell>
                  </TableRow>
                </Table.Footer>
              }
            </Table>
          </div>
          : <Segment>{ search.investors ? 'No shareholders match your search criteria' : 'No shareholder data available' }</Segment>
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
                            to={`https://${window.REACT_APP_APP_TYPE && !/(enegra|polymath|kovan)/.test(window.location.hostname) ? '' : 'kovan.'}etherscan.io/tx/${transaction.transactionHash}`}
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
                            to={`https://${window.REACT_APP_APP_TYPE && !/(enegra|polymath|kovan)/.test(window.location.hostname) ? '' : 'kovan.'}etherscan.io/address/${transaction.fromEthAddress}`}
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
                            to={`https://${window.REACT_APP_APP_TYPE && !/(enegra|polymath|kovan)/.test(window.location.hostname) ? '' : 'kovan.'}etherscan.io/address/${transaction.shareholderEthAddress}`}
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
      }, {
        menuItem: 'Governance',
        render: () => {
          return (
            <div>
              <br />
              <Image src='/images/under-construction.png' size='medium' centered />
              <br />
              <Grid columns={2}>
                <Grid.Column>
                  <Segment>
                    <Header as='h2' textAlign='center'>Governance Group Actions</Header>
                    <br />
                    <Button>Mint Shares</Button><Input style={{ marginLeft: '10px' }} /><br /><br />
                    <Button>Distribute Shares</Button><br />To: <Input style={{ marginLeft: '10px' }} /><br />Amount: <Input style={{ marginLeft: '10px' }} /><br /><br />
                    <Button>Arbitrate Shares</Button><br />From: <Input style={{ marginLeft: '10px' }} /><br />To: <Input style={{ marginLeft: '10px' }} /><br />Amount: <Input style={{ marginLeft: '10px' }} /><br /><br />
                    <Button>Add Officer</Button><Input style={{ marginLeft: '10px' }} /><br /><br />
                    <Button>Remove Officer</Button><Input style={{ marginLeft: '10px' }} />
                  </Segment>
                </Grid.Column>
                <Grid.Column>
                  <Segment>
                    <Header as='h2' textAlign='center'>Officer Settings</Header>
                    <br />
                    <Button>Lock trading</Button><Label style={{ marginLeft: '10px' }}>Yes</Label><br /><br />
                    <Button>Add Whitelist to Token</Button><Label style={{ marginLeft: '10px' }}>No</Label><br /><br />
                    <Button>Remove Whitelist from Token</Button><Label style={{ marginLeft: '10px' }}>No</Label><br /><br />
                    <Button>Set Initial Offer End Date</Button><Label style={{ marginLeft: '10px' }}>No</Label><br /><br />
                    <Button>Set Allowing/Disallowing New Shareholders</Button><Label style={{ marginLeft: '10px' }}>Yes</Label>
                  </Segment>
                </Grid.Column>
              </Grid>
            </div>
          )
        }
      }
    ]
    return (
      <div className='investorsComponent'>
        { currentToken !== 'none' && <Header as='h2' className='tokenHeader'>
          <a
            href={`https://${window.REACT_APP_APP_TYPE && !/(enegra|polymath|kovan)/.test(window.location.hostname) ? '' : 'kovan.'}etherscan.io/address/${localToken.address}`}
            target='_blank'
            rel='noopener noreferrer'>
            {localToken.name}
          </a>
        </Header> }
        <div className='stats'>
          <StatsCard stats={stats} />
        </div>
        { locked !== undefined &&
          <div className='tradingToggle'>
            <span>
              <strong>Trading: </strong>
              {locked ? 'Paused' : 'Active'}
            </span>
            <Checkbox
              toggle
              onChange={handleSetTradingLock}
              checked={!locked} />
          </div>
        }
        <div>
          <Input loading={currentToken !== 'none' && !loaded} icon={activeIndex === 0 ? 'user' : 'dollar'} placeholder='Search...' onChange={handleSearch} value={activeIndex === 0 ? search['investors'] : search.transactions} />
        </div>
        <br />
        { currentToken === 'none' ? <Segment>You must select or create a security token to use the registry of security owners</Segment>
          : !loaded
          ? <span>Loading token details...<Icon name='spinner' loading /></span>
          : <Tab
            activeIndex={activeIndex}
            menu={{ secondary: true, pointing: true }}
            panes={panes}
            onTabChange={(e, { activeIndex }) => { setSearch(activeIndex === 0 ? 'investors' : 'transactions', ''); this.setState({ activeIndex }) }}
            className='tableTabs' /> }
      </div>
    )
  }
}

export default InvestorDetailView

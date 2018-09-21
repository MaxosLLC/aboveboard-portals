import React, { Component } from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { Icon, Image, Input, Pagination, Segment, Table } from 'semantic-ui-react'

import ethereum from 'lib/ethereum'

const iconsPath = '/images/icons'
const sortUpSrc = `${iconsPath}/up.svg`
const sortDownSrc = `${iconsPath}/down.svg`

class PendingTransactionsView extends Component {
  componentDidMount () {
    this.props.loadPendingTransactions()
    this.props.loadMultisigWallet()
  }

  render () {
    const { loaded, pendingTransactions, setPage, setSort, setSearch, page, search, queryResult } = this.props

    const transactionsHeaders = [
      { name: 'Hash', sortOption: 'transactionHash' },
      { name: 'Type', sortOption: 'methodHex' },
      { name: 'From', sortOption: 'from' },
      { name: 'To', sortOption: 'to' },
      { name: 'Estimated Gas', sortOption: 'estimatedGasLimit' },
      { name: 'Date', sortOption: 'createdAt' }
    ]

    return (
      <div className='pendingTransactionsComponent'>
        <div>
          <Input loading={!loaded} icon='dollar' placeholder='Search...' onChange={(e, { value }) => { setSearch(value) }} value={search} />
        </div>
        <br />
        {!loaded
          ? <span>Loading pending transactions...<Icon name='spinner' loading /></span>
          : pendingTransactions.length
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
                            onClick={() => { setSort({ [transactionsHeader.sortOption]: 1 }) }} />
                          <Image
                            src={sortDownSrc}
                            onClick={() => { setSort({ [transactionsHeader.sortOption]: -1 }) }} />
                        </span>
                      </Table.HeaderCell>
                    ) }
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {pendingTransactions
                      .map(pendingTransaction => <Table.Row key={pendingTransaction.id}>
                        <Table.Cell>
                          <Link
                            to={`https://${window.REACT_APP_APP_TYPE && !/(enegra|polymath|kovan)/.test(window.location.hostname) ? '' : 'kovan.'}etherscan.io/tx/${pendingTransaction.transactionHash}`}
                            target='_blank'
                            rel='noopener noreferrer'>
                            {pendingTransaction
                              .transactionHash
                              .substr(0, 4)}...{pendingTransaction
                              .transactionHash
                              .substr(pendingTransaction.transactionHash.length - 4, 4)}
                          </Link>
                        </Table.Cell>
                        <Table.Cell>{ethereum.methodByHex[pendingTransaction.methodHex]}</Table.Cell>
                        <Table.Cell>
                          <Link
                            to={`https://${window.REACT_APP_APP_TYPE && !/(enegra|polymath|kovan)/.test(window.location.hostname) ? '' : 'kovan.'}etherscan.io/address/${pendingTransaction.from}`}
                            target='_blank'
                            rel='noopener noreferrer'>
                            {pendingTransaction
                              .from
                              .substr(0, 4)}...{pendingTransaction
                              .from
                              .substr(pendingTransaction.from.length - 4, 4)}
                          </Link>
                        </Table.Cell>
                        <Table.Cell>
                          { pendingTransaction.to &&
                            <Link
                              to={`https://${window.REACT_APP_APP_TYPE && !/(enegra|polymath|kovan)/.test(window.location.hostname) ? '' : 'kovan.'}etherscan.io/address/${pendingTransaction.to}`}
                              target='_blank'
                              rel='noopener noreferrer'>
                              {pendingTransaction
                                .to
                                .substr(0, 4)}...{pendingTransaction
                                .to
                                .substr(pendingTransaction.to.length - 4, 4)}
                            </Link>
                          }
                        </Table.Cell>
                        <Table.Cell>{pendingTransaction.estimatedGasLimit}</Table.Cell>
                        <Table.Cell>{moment(pendingTransaction.createdAt).format('LL')}</Table.Cell>
                      </Table.Row>)}
                </Table.Body>

                <Table.Footer>
                  <Table.Row>
                    <Table.HeaderCell floated='right' colSpan={transactionsHeaders.length}>
                      <Pagination
                        floated='right'
                        activePage={page + 1}
                        totalPages={
                          queryResult.pendingTransactions
                            ? Math.floor(
                                queryResult.pendingTransactions.total /
                                  queryResult.pendingTransactions.limit
                              ) + 1
                            : 1
                        }
                        onPageChange={(e, { activePage }) => setPage(activePage - 1)}
                      />
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Footer>
              </Table>
            </div>
          </div>
          : <Segment>{ search ? 'No transactions match your search criteria' : 'No transactions have been made yet' }</Segment>
        }
      </div>
    )
  }
}

export default PendingTransactionsView

import React, { Component } from 'react'
import moment from 'moment'
import {
	Table,
	Image
} from 'semantic-ui-react'
import { Link } from 'react-router-dom'

import sort_button from '../../../../assets/image/arrows.png'
import download_button from '../../../../assets/image/downloadbutton.png'
import './TokenDetail.css'

class TransactionsTable extends Component {
	constructor() {
		super()
		this.state = {
			sortOption: 'hash'
		}
	}

	render() {
		const { transactions, shareholders } = this.props
		const getShareholderName = address => {
			const shareholder = shareholders.filter(shareholder =>
				shareholder.ethAddresses.some(
					ethAddress => ethAddress.address === address
				)
			)[0]

			return shareholder && shareholder.firstName
				? `${shareholder.firstName} ${shareholder.lastName}`
				: ''
		}

		//  Sort function for Transaction Table
		if (this.state.transactionSortOption === 'hash') {
			transactions.sort(function(fobj, sobj) {
				return (
					parseInt(fobj.transactionHash, 16) -
					parseInt(sobj.transactionHash, 16)
				)
			})
		}
		// if (this.state.transactionSortOption === 'shareholder') {
		//   transactions.sort(function(fobj, sobj) {
		//     if (fobj.firstName.toLowerCase() < sobj.firstName.toLowerCase())
		//       return -1
		//     if (fobj.firstName.toLowerCase() > sobj.firstName.toLowerCase())
		//       return 1
		//     return 0
		//   })
		// }
		if (this.state.transactionSortOption === 'address') {
			transactions.sort(function(fobj, sobj) {
				return (
					parseInt(fobj.shareholderEthAddress, 16) -
					parseInt(sobj.shareholderEthAddress, 16)
				)
			})
		}
		if (this.state.transactionSortOption === 'quantity') {
			transactions.sort(function(fobj, sobj) {
				return fobj.tokens - sobj.tokens
			})
		}
		// if (this.state.transactionSortOption === 'date') {
		//   transactions.sort(function(fobj, sobj) {
		//     if (fobj.firstName.toLowerCase() < sobj.firstName.toLowerCase())
		//       return -1
		//     if (fobj.firstName.toLowerCase() > sobj.firstName.toLowerCase())
		//       return 1
		//     return 0
		//   })
		// }
		return (
			<Table celled>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell>
							Hash<img
								className="sortButton"
								src={sort_button}
								alt="Sort"
								onClick={() => this.setState({ transactionSortOption: 'hash' })}
							/>
						</Table.HeaderCell>
						<Table.HeaderCell>
							Shareholder<img
								className="sortButton"
								src={sort_button}
								alt="Sort"
								onClick={() =>
									this.setState({ transactionSortOption: 'shareholder' })
								}
							/>
						</Table.HeaderCell>
						<Table.HeaderCell>
							Address<img
								className="sortButton"
								src={sort_button}
								alt="Sort"
								onClick={() =>
									this.setState({ transactionSortOption: 'address' })
								}
							/>
						</Table.HeaderCell>
						<Table.HeaderCell>
							Quantity<img
								className="sortButton"
								src={sort_button}
								alt="Sort"
								onClick={() =>
									this.setState({ transactionSortOption: 'quantity' })
								}
							/>
						</Table.HeaderCell>
						<Table.HeaderCell>
							Date<img
								className="sortButton"
								src={sort_button}
								alt="Sort"
								onClick={() => this.setState({ transactionSortOption: 'date' })}
							/>
						</Table.HeaderCell>
						<Table.HeaderCell>
							<Image className="downloadBtn" src={download_button} />
						</Table.HeaderCell>
					</Table.Row>
				</Table.Header>

				<Table.Body>
					{transactions.map(transaction => (
						<Table.Row key={transaction.id}>
							<Table.Cell>
								<Link
									to={`https://kovan.etherscan.io/tx/${
										transaction.transactionHash
									}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									{transaction.transactionHash.substr(0, 4)}...{transaction.transactionHash.substr(
										transaction.transactionHash.length - 4,
										4
									)}
								</Link>
							</Table.Cell>
							<Table.Cell>
								{getShareholderName(transaction.shareholderEthAddress)}
							</Table.Cell>
							<Table.Cell>
								<Link
									to={`https://kovan.etherscan.io/address/${
										transaction.shareholderEthAddress
									}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									{transaction.shareholderEthAddress.substr(0, 4)}...{transaction.shareholderEthAddress.substr(
										transaction.shareholderEthAddress.length - 4,
										4
									)}
								</Link>
							</Table.Cell>
							<Table.Cell>{transaction.tokens}</Table.Cell>
							<Table.Cell>
								{moment(transaction.createdAt).format('LLL')}
							</Table.Cell>
							<Table.Cell />
						</Table.Row>
					))}
				</Table.Body>
			</Table>
		)
	}
}

export default TransactionsTable
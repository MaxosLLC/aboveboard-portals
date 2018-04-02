import React, { Component } from 'react'
import { Table, Image } from 'semantic-ui-react'

import sort_button from '../../../../assets/image/arrows.png'
import download_button from '../../../../assets/image/downloadbutton.png'
import './TokenDetail.css'

class ShareholdersTable extends Component {
	constructor() {
		super()
		this.state = {
			sortOption: 'shareholder'
		}
	}

	render() {
		const { shareholders, routeTo, token } = this.props
		const shareholdersWithData = shareholders.filter(
			shareholder => shareholder.firstName
		)

		var quantityValues = [], totalValue = 0
		shareholdersWithData.map(shareholderWithData => {
			quantityValues.push(shareholderWithData.ethAddresses[0].issues[0].tokens)
			totalValue += shareholderWithData.ethAddresses[0].issues[0].tokens
			return null
		})

		//  Sort function for Sharepoint Table.
		if (this.state.sortOption === 'shareholder') {
			shareholdersWithData.sort(function(fobj, sobj) {
				if (fobj.firstName.toLowerCase() < sobj.firstName.toLowerCase())
					return -1
				if (fobj.firstName.toLowerCase() > sobj.firstName.toLowerCase())
					return 1
				return 0
			})
		}
		if (this.state.sortOption === 'address') {
			shareholdersWithData.sort(function(fobj, sobj) {
				if (fobj.addressLine1.toLowerCase() < sobj.addressLine1.toLowerCase())
					return -1
				if (fobj.addressLine1.toLowerCase() > sobj.addressLine1.toLowerCase())
					return 1
				return 0
			})
		}
		// if (this.state.sortOption === 'qualifier') {
		//   shareholdersWithData.sort(function(fobj, sobj) {
		//     if (fobj.qualifier.toLowerCase() < sobj.qualifier.toLowerCase())
		//       return -1
		//     if (fobj.qualifier.toLowerCase() > sobj.qualifier.toLowerCase())
		//       return 1
		//     return 0
		//   })
		// }
		// if (this.state.sortOption === 'quantity') {
		//   shareholdersWithData.sort(function(fobj, sobj) {
		//     if (fobj.quantity.toLowerCase() < sobj.quantity.toLowerCase())  //this is dummy for now
		//       return -1
		//     if (fobj.quantity.toLowerCase() > sobj.quantity.toLowerCase())  //this is dummy for now
		//       return 1
		//     return 0
		//   })
		// }
		// if (this.state.sortOption === 'total') {
		//   shareholdersWithData.sort(function(fobj, sobj) {
		//     if (fobj.total.toLowerCase() < sobj.total.toLowerCase())
		//       return -1
		//     if (fobj.total.toLowerCase() > sobj.total.toLowerCase())
		//       return 1
		//     return 0
		//   })
		// }
		if (this.state.sortOption === 'date') {
			shareholdersWithData.sort(function(fobj, sobj) {
				if (fobj.updatedAt < sobj.updatedAt) return -1
				if (fobj.updatedAt > sobj.updatedAt) return 1
				return 0
			})
		}

		return (
			<Table celled selectable>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell className="idHeader">ID</Table.HeaderCell>
						<Table.HeaderCell>
							Shareholder<img
								className="sortButton"
								src={sort_button}
								alt="Sort"
								onClick={() => this.setState({ sortOption: 'shareholder' })}
							/>
						</Table.HeaderCell>
						<Table.HeaderCell>
							Address<img
								className="sortButton"
								src={sort_button}
								alt="Sort"
								onClick={() => this.setState({ sortOption: 'address' })}
							/>
						</Table.HeaderCell>
						<Table.HeaderCell>
							Qualifier<img
								className="sortButton"
								src={sort_button}
								alt="Sort"
								onClick={() => this.setState({ sortOption: 'qualifier' })}
							/>
						</Table.HeaderCell>
						<Table.HeaderCell>
							Quantity<img
								className="sortButton"
								src={sort_button}
								alt="Sort"
								onClick={() => this.setState({ sortOption: 'quantity' })}
							/>
						</Table.HeaderCell>
						<Table.HeaderCell>
							% of Total<img
								className="sortButton"
								src={sort_button}
								alt="Sort"
								onClick={() => this.setState({ sortOption: 'total' })}
							/>
						</Table.HeaderCell>
						<Table.HeaderCell>
							Last Transaction<img
								className="sortButton"
								src={sort_button}
								alt="Sort"
								onClick={() => this.setState({ sortOption: 'date' })}
							/>
						</Table.HeaderCell>
						<Table.HeaderCell>
							<Image className="downloadBtn" src={download_button} />
						</Table.HeaderCell>
					</Table.Row>
				</Table.Header>

				<Table.Body>
					{shareholdersWithData.map((shareholder, i) => {
						var date = new Date(shareholder.updatedAt)
						return (
							<Table.Row
								key={shareholder.id}
								onClick={() =>
									routeTo(
										`/tokens/${token.address}/shareholders/${
											shareholder.id
										}/detail`
									)
								}
								style={{ cursor: 'pointer' }}
							>
								<Table.Cell>{i}</Table.Cell>
								<Table.Cell>
									{shareholder.firstName} {shareholder.lastName}
								</Table.Cell>
								<Table.Cell>
									{shareholder.addressLine1}{' '}
									{shareholder.addressLine2
										? `${shareholder.addressLine1} `
										: ''}, {shareholder.city},{' '}
									{shareholder.state ? `${shareholder.state} ,` : ''}{' '}
									{shareholder.country}, {shareholder.zip}
								</Table.Cell>
								<Table.Cell>{shareholder.qualifications}</Table.Cell>
								<Table.Cell>{quantityValues[i]}</Table.Cell>
								<Table.Cell />
								<Table.Cell>
									{date.getMonth() +
										1 +
										'.' +
										date.getDate() +
										'.' +
										date.getFullYear()}
								</Table.Cell>
								<Table.Cell />
							</Table.Row>
						)
					})}
				</Table.Body>
			</Table>
		)
	}
}

export default ShareholdersTable
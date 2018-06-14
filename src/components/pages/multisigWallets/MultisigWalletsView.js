import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'

class MultisigWalletsView extends Component {
  render () {
    const { some, pushMe, addresses } = this.props

    const handleRowClick = () => {} // TODO: implement

    return (
      <div className='multisigWalletsComponent'>
      <span>Initial State: {some}</span>
      <br />
      <Button onClick={pushMe}>Push Me</Button>
      <br />
      <br />
      <Table className='abTable' unstackable>
        <Table.Header className='tableHeader'>
          <TableRow >
            <Table.HeaderCell>Wallet Address</Table.HeaderCell>
          </TableRow>
        </Table.Header>
        <Table.Body>
          { addresses.map(address =>
          <TableRow
            name='tokens'
            key={address}
            onClick={() => handleRowClick(address)}
            style={{
              cursor: 'pointer'
            }}>
            <Table.Cell>{address}</Table.Cell>
          </TableRow>
          )}
        </Table.Body>
        </Table>
      </div>
    )
  }
}

export default MultisigWalletsView

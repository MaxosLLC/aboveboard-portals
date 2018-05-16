import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Button, Grid, Header, Icon, Input, Image, Pagination, Segment, Table } from 'semantic-ui-react'

import './investors.css'

const qualificationByCode = {
  'us-accredited': 'US Accredited',
  'us-qib': 'US QIB'
}

const iconsPath = '/images/icons'
const sortUpSrc = `${iconsPath}/up.svg`
const sortDownSrc = `${iconsPath}/down.svg`

class InvestorsView extends Component {

  constructor(props) {
    super(props)

    this.onSelectCSV = this.onSelectCSV.bind(this)
  }
  componentDidMount () {
    this.props.loadInvestors()
  }

  onSelectCSV(e) {

  }

  render () {
    const { loaded, investors, routeTo, queryResult, setSort, setPage, setSearch, page, search } = this.props

    const investorsHeaders = [
      { name: '#', sortOption: '_id' },
      { name: 'First Name', sortOption: 'firstName' },
      { name: 'Last Name', sortOption: 'lastName' },
      { name: 'Email', sortOption: 'email' },
      { name: 'Phone', sortOption: 'phone' },
      { name: 'Address', sortOption: 'country' },
      { name: 'Qualifications', sortOption: 'qualifications' }
    ]

    return (
      <div className='investorsComponent'>
        <Grid centered columns={1}>
          <Grid.Column width={4}>
            <Header as='h2' textAlign='center' style={{ marginBottom: '20px' }}>
              Buyers
            </Header>
          </Grid.Column>
        </Grid>

        <div>
          <Input loading={!loaded} icon='user' placeholder='Search...' onChange={(e, { value }) => setSearch(value)} value={search.investors} />
          <Link to='/buyers/add' className='ui button right floated'>
            Add Buyer
          </Link>
        </div>
        <div className='csvUpload'>
          <small>Import buyers with CSV file:</small>
          <div>
            <Input 
              onChange={this.onSelectCSV}
              type='file'
            />
          </div>
        </div>

        { !loaded
          ? <span>Loading buyer details...<Icon name='spinner' loading /></span>
          : investors.length
          ? <div className='tableContainer'>
            <Table className='abTable' unstackable>
              <Table.Header className='tableHeader'>
                <Table.Row>
                  { investorsHeaders.map((investorsHeader, i) =>
                    <Table.HeaderCell key={`${investorsHeader.name}${i}`}>{investorsHeader.name}
                      <span className='sortButtons'>
                        <Image
                          src={sortUpSrc}
                          onClick={() => { setSort({ [investorsHeader.sortOption]: 1 }) }} />
                        <Image
                          src={sortDownSrc}
                          onClick={() => { setSort({ [investorsHeader.sortOption]: -1 }) }} />
                      </span>
                    </Table.HeaderCell>
                  ) }
                  <Table.HeaderCell>Edit</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {investors
                  .map((investor, i) =>
                    <Table.Row key={investor.id + i}>
                      <Table.Cell>{i + 1}</Table.Cell>
                      <Table.Cell>{investor.firstName}</Table.Cell>
                      <Table.Cell>{investor.lastName}</Table.Cell>
                      <Table.Cell>{investor.email}</Table.Cell>
                      <Table.Cell>{investor.phone}</Table.Cell>
                      <Table.Cell>
                        {investor.addressLine1}
                        {investor.addressLine2
                            ? ` ${investor.addressLine2},`
                            : ','}{' '}
                        <br />
                        {investor.city},{' '}
                        {investor.state ? `${investor.state}, ` : ''}
                        <br />
                        {investor.country}, {investor.zip}
                      </Table.Cell>
                      <Table.Cell>
                        {qualificationByCode[investor.qualifications] || ''}
                      </Table.Cell>
                      <Table.Cell style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                          onClick={() => routeTo(`/buyers/${investor.id}/edit`)}>
                          Edit
                        </Button>
                        <Button
                          onClick={() => routeTo(`/buyers/${investor.id}/detail`)}>
                          Details
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  )}
              </Table.Body>

              { queryResult.total > queryResult.limit ? <Table.Footer>
                <Table.Row>
                  <Table.HeaderCell floated='right' colSpan='8'>
                    <Pagination
                      floated='right'
                      activePage={page.investors + 1}
                      totalPages={
                        queryResult
                          ? Math.floor(queryResult.total / queryResult.limit) + 1
                          : 1
                      }
                      onPageChange={(e, { activePage }) => setPage(activePage - 1)}
                    />
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Footer> : null }
            </Table>
          </div>
          : <Segment>{ search.investors ? 'No buyers match your search criteria' : 'No buyer data available' }</Segment> }
      </div>
    )
  }
}

export default InvestorsView

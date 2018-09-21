import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Accordion, Grid, Icon, Input, Image, Pagination, Segment, Table, Dropdown } from 'semantic-ui-react'

import { readFile } from 'lib/file'
import { csvToJson, arrayToBuyer } from 'lib/csv'

const iconsPath = '/images/icons'
const sortUpSrc = `${iconsPath}/up.svg`
const sortDownSrc = `${iconsPath}/down.svg`

class InvestorsView extends Component {
  constructor (props) {
    super(props)
    this.onSelectCSV = this.onSelectCSV.bind(this)
    this.onChangeWhitelists = this.onChangeWhitelists.bind(this)

    this.state = { whitelists: [] }
  }

  componentDidMount () {
    if (this.props.currentUser.role === 'buyer') {
      return this.props.routeTo('/')
    }

    this.props.loadInvestors()
  }

  async onSelectCSV (e) {
    const target = e.target
    const str = await readFile(e.target.files[0])
    const rows = await csvToJson(str)
    const buyers = rows.map(arrayToBuyer)

    try {
      await this.props.addInvestorsToWhitelists(buyers, this.state.whitelists)
    } catch (e) {
      console.error(e)
      // TODO: render error message here
    }

    target.value = ''
  }

  onChangeWhitelists (e, data) {
    const whitelists = data.value.map(address => {
      const name = data.options.find(option => option.value === address).text

      return { name, address }
    })

    this.setState({ whitelists })
  }

  render () {
    const { loaded, investors, routeTo, queryResult, setSort, setPage, setSearch, page, search, whitelists } = this.props
    const { activeIndex } = this.state
    const whitelistOptions = whitelists.map(whitelist => {
      return {
        text: whitelist.name,
        value: whitelist.address
      }
    })
    const investorsHeaders = [
      { name: 'First Name', sortOption: 'firstName' },
      { name: 'Last Name', sortOption: 'lastName' },
      { name: 'Email', sortOption: 'email' }
    ]

    const handleMultipleUploadClick = (e, { index }) => {
      const newIndex = activeIndex === index ? -1 : index

      this.setState({ activeIndex: newIndex })
    }

    return (
      <div className='investorsComponent'>
        <div>
          <Input loading={!loaded} icon='user' placeholder='Search...' onChange={(e, { value }) => setSearch(value)} value={search.investors} />
          <Link to='/owners/add' className='ui button right floated'>
            Add Owner
          </Link>
        </div>
        <div className='csvUpload'>
          <Accordion>
            <Accordion.Title active={activeIndex === 0} index={0} onClick={handleMultipleUploadClick}>
              <Icon name='dropdown' />
            Upload Multiple Owners
          </Accordion.Title>
            <Accordion.Content active={activeIndex === 0}>
              <small>First choose whitelists and select the CSV file to upload.</small>

              <Fragment>
                <Grid.Column style={{ padding: '10px' }}>
                  <Dropdown
                    placeholder='Add Whitelist Address:'
                    selection
                    search
                    multiple
                    name='whitelists'
                    options={whitelistOptions}
                    onChange={this.onChangeWhitelists}
                />
                </Grid.Column>
              </Fragment>

              <div>
                <Input
                  onChange={this.onSelectCSV}
                  type='file'
                  disabled={!this.state.whitelists.length}
              />
              </div>
            </Accordion.Content>
          </Accordion>
        </div>

        { !loaded
          ? <span>Loading owner details...<Icon name='spinner' loading /></span>
          : investors.length
          ? <div className='tableContainer'>
            <Table className='abTable' unstackable>
              <Table.Header className='tableHeader'>
                <Table.Row>
                  { investorsHeaders.map((investorsHeader, i) =>
                    <Table.HeaderCell key={`${investorsHeader.name}${i}`}>{investorsHeader.name}
                      { investors.length > 6 && <span className='sortButtons'>
                        <Image
                          src={sortUpSrc}
                          onClick={() => { setSort({ [investorsHeader.sortOption]: 1 }) }} />
                        <Image
                          src={sortDownSrc}
                          onClick={() => { setSort({ [investorsHeader.sortOption]: -1 }) }} />
                      </span> }
                    </Table.HeaderCell>
                  ) }
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {investors
                  .map((investor, i) =>
                    <Table.Row key={investor.id + i} onClick={() => routeTo(`/owners/${investor.id}/edit`)} style={{ cursor: 'pointer' }}>
                      <Table.Cell>{investor.firstName || 'No'}</Table.Cell>
                      <Table.Cell>{investor.lastName || 'Data'}</Table.Cell>
                      <Table.Cell>{investor.email}</Table.Cell>
                    </Table.Row>
                  )}
              </Table.Body>

              { queryResult.total > queryResult.limit &&
                <Table.Footer>
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
                </Table.Footer>
              }
            </Table>
          </div>
          : <Segment>{ search.investors ? 'No owners match your search criteria' : 'No owners' }</Segment> }
      </div>
    )
  }
}

export default InvestorsView

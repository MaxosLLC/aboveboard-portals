import React, { Component } from 'react'
import ReactDOMServer from 'react-dom/server'

import moment from 'moment'
import {
  Button,
  Pagination,
  Grid,
  Header,
  Icon,
  Segment,
  Tab,
  Table,
} from 'semantic-ui-react'
import { Link } from 'react-router-dom'

class InvestorDetailView extends Component {
  componentDidMount() {
    this.props.loadShareholders()
    this.props.loadTransactions()
  }

  render() {
    const { loaded, token, transactions, shareholders, routeTo } = this.props

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

    const shareholdersWithData = shareholders.filter(
      shareholder => shareholder.firstName
    )
    const allShareholders = async () => {
      this.props.loadShareholders(0, 0)
      let shareholders = await this.props.shareholders
      this.props.loadShareholders()
      return shareholders
    }
    const printShareholders = () => {
      let shareholders
      allShareholders().then(value => {
        shareholders = value

        const shareholdersWithData = shareholders.filter(
          shareholder => shareholder.firstName
        )

        let content = shareholdersWithData.length ? (
          <Table celled selectable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>#</Table.HeaderCell>
                <Table.HeaderCell>First Name</Table.HeaderCell>
                <Table.HeaderCell>Last Name</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Phone</Table.HeaderCell>
                <Table.HeaderCell>Address</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {shareholdersWithData.map((shareholder, i) => (
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
                  <Table.Cell>{shareholder.firstName}</Table.Cell>
                  <Table.Cell>{shareholder.lastName}</Table.Cell>
                  <Table.Cell>{shareholder.email}</Table.Cell>
                  <Table.Cell>{shareholder.phone}</Table.Cell>
                  <Table.Cell>
                    {shareholder.addressLine1}{' '}
                    {shareholder.addressLine2
                      ? `${shareholder.addressLine1} `
                      : ''}, {shareholder.city},{' '}
                    {shareholder.state ? `${shareholder.state} ,` : ''}{' '}
                    {shareholder.country}, {shareholder.zip}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        ) : (
          <Segment>No shareholder data available</Segment>
        )
        // frames['iframeContents'].document.head.appendChild(cssLink)
        // console.log("document.getElementById('iframeContents').contentWindow, document.getElementById('iframeContents').contentDocument, document.getElementById('iframeContents')", document.getElementById('iframeContents').contentWindow, document.getElementById('iframeContents').contentDocument, document.getElementById('iframeContents'))
        // ReactDOM.render(content, document.getElementById('iframeContents'))
        // printIframeDocument.body.appendChild(cssLink)
        // var frm = iframeDoc.createElement('form');
        // var s = printIframeDocument.createElement('script');
        // // iframeBody.appendChild(frm);
        // iframeBody.appendChild(s);
        // printIframeDocument.document.write(cssLink1)
        // printIframeDocument.document.write(cssLink2)
        // printIframeDocument.document.write(cssLink3)
        // let str = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.9/semantic.min.css"/><script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.9/semantic.min.js"></script>'
        // printIframeDocument.document.write(str);
        // document.getElementById('iframeContents').contentDocument.body.write(cssLink)
        // document.getElementById('iframeContents').head.appendChild(cssLink)

        window.onload = function() {
          var frameElement = document.getElementById('text-field')
          var doc = frameElement.contentDocument
          doc.body.contentEditable = true
          doc.body.innerHTML =
            doc.body.innerHTML + '<style>body {color:red;}</style>'
        }

        let printIframeDocument =
          document.getElementById('iframeContents').contentWindow.document ||
          document.getElementById('iframeContents').contentDocument
        printIframeDocument.body.contentEditable = true
        let iframeHead = printIframeDocument.head
        printIframeDocument.open()
        printIframeDocument.write(ReactDOMServer.renderToString(content))
        printIframeDocument.close()
        let cssLink1 = printIframeDocument.createElement('link')
        cssLink1.href =
          'https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.1/semantic.css'
        cssLink1.rel = 'stylesheet'
        cssLink1.type = 'text/css'
        iframeHead.appendChild(cssLink1)

        let cssLink2 = printIframeDocument.createElement('script')
        cssLink2.href =
          'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js'
        iframeHead.appendChild(cssLink2)

        let cssLink3 = printIframeDocument.createElement('script')
        cssLink3.href =
          'https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.9/semantic.min.js'
        iframeHead.appendChild(cssLink3)

        console.log(
          "document.getElementById('iframeContents').contentWindow, document.getElementById('iframeContents').contentDocument, document.getElementById('iframeContents')",
          document.getElementById('iframeContents').contentWindow,
          document.getElementById('iframeContents').contentDocument,
          document.getElementById('iframeContents')
        )

        document.getElementById('iframeContents').contentWindow.focus()
        document.getElementById('iframeContents').contentWindow.print()
      })
    }

    const panes = [
      {
        menuItem: 'Shareholders',
        render: () =>
          shareholdersWithData.length ? (
            <Table celled selectable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>#</Table.HeaderCell>
                  <Table.HeaderCell>First Name</Table.HeaderCell>
                  <Table.HeaderCell>Last Name</Table.HeaderCell>
                  <Table.HeaderCell>Email</Table.HeaderCell>
                  <Table.HeaderCell>Phone</Table.HeaderCell>
                  <Table.HeaderCell>Address</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {shareholdersWithData.map((shareholder, i) => (
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
                    <Table.Cell>{shareholder.firstName}</Table.Cell>
                    <Table.Cell>{shareholder.lastName}</Table.Cell>
                    <Table.Cell>{shareholder.email}</Table.Cell>
                    <Table.Cell>{shareholder.phone}</Table.Cell>
                    <Table.Cell>
                      {shareholder.addressLine1}{' '}
                      {shareholder.addressLine2
                        ? `${shareholder.addressLine1} `
                        : ''}, {shareholder.city},{' '}
                      {shareholder.state ? `${shareholder.state} ,` : ''}{' '}
                      {shareholder.country}, {shareholder.zip}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
              <Table.Footer>
                <Table.Row>
                  <Table.HeaderCell floated="right" colSpan="8">
                    <Button onClick={() => printShareholders()}>
                      Print Shareholders
                    </Button>
                    <Pagination
                      floated="right"
                      defaultActivePage={1}
                      totalPages={
                        this.props.queryResult
                          ? Math.floor(
                              this.props.queryResult.total /
                                this.props.queryResult.limit
                            ) + 1
                          : 1
                      }
                      onPageChange={(e, { activePage }) => {
                        this.props.loadShareholders(25 * (activePage - 1), 25)
                      }}
                    />
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Footer>
            </Table>
          ) : (
            <Segment>No shareholder data available</Segment>
          ),
      },
      {
        menuItem: 'Transactions',
        render: () =>
          transactions.length ? (
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Transaction Hash</Table.HeaderCell>
                  <Table.HeaderCell>Shareholder Name</Table.HeaderCell>
                  <Table.HeaderCell>Shareholder Address</Table.HeaderCell>
                  <Table.HeaderCell>Tokens Transferred</Table.HeaderCell>
                  <Table.HeaderCell>Date</Table.HeaderCell>
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
                  </Table.Row>
                ))}
              </Table.Body>
              <Table.Footer>
                <Table.Row>
                  <Table.HeaderCell floated="right" colSpan="8">
                    <Pagination
                      floated="right"
                      defaultActivePage={1}
                      totalPages={
                        this.props.queryResult
                          ? Math.floor(
                              this.props.queryResult.total /
                                this.props.queryResult.limit
                            ) + 1
                          : 1
                      }
                      onPageChange={(e, { activePage }) => {
                        this.props.loadTransactions(25 * (activePage - 1))
                      }}
                    />
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Footer>
            </Table>
          ) : (
            <Segment>No transactions have been made yet</Segment>
          ),
      },
    ]

    return (
      <div className="investorsComponent">
        <iframe
          title="iframeContents"
          id="iframeContents"
          contenteditable="true"
          style={{ height: '0px', width: '0px', position: 'absolute' }}
        >
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.9/semantic.min.css"
          />
          <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js" />
          <script src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.9/semantic.min.js" />
        </iframe>
        <Grid centered columns={1}>
          <Grid.Column width={10}>
            <Header as="h2" textAlign="center">
              Token Detail
            </Header>
            <Header as="h3" textAlign="center">
              <Link
                to={`https://kovan.etherscan.io/address/${token.address}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {token.name}
              </Link>
            </Header>
          </Grid.Column>
        </Grid>

        {!loaded ? (
          <span>
            Loading token details...<Icon name="spinner" loading />
          </span>
        ) : (
          <Tab panes={panes} />
        )}
      </div>
    )
  }
}

export default InvestorDetailView

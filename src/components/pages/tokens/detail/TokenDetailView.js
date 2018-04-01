import React, { Component } from 'react'
import {
  Grid,
  Icon,
  Segment,
  Tab,
  Image,
  Checkbox,
  Modal,
  Button
} from 'semantic-ui-react'
import styled from 'styled-components'

import ShareholdersTable from './ShareholdersTable'
import TransactionsTable from './TransactionsTable'
import ColorRegistry from '../../../../assets/ColorRegistry'
import tokenIcon from '../../../../assets/image/Info.png'
import userGraphic from '../../../../assets/image/graphic.png'
import path from '../../../../assets/image/Path.png'
import calendarIcon from '../../../../assets/image/calendaricon.png'
import './TokenDetail.css'

const TokenDetailView = styled.div`
  margin-top: 0px;
`

const TokenDetailHeader = styled.h2`
  font-size: 32px;
  color: ${ColorRegistry.headColor};
  font-family: 'Futura Medium';
  font-weight: 200;'
`

const TypeCountLabel = styled.h3`
  font-size: 42px;
  color: ${ColorRegistry.bodyColor};
  font-weight: 600;
  line-height: 1;
  font-family: 'ProximaNova Regular';
`

const TypeLabel = styled.p`
  font-size: 18px;
  color: ${ColorRegistry.bodyColor};
  line-height: 1.22;
`

const TradingOptionLabel = styled.p`
  font-size: 18px;
  color: ${ColorRegistry.bodyColor};
  margin-top: auto !important;
  margin-bottom: auto;
  margin-right: 15px;
  width: 130px;
  text-align: left;
`

class InvestorDetailView extends Component {
  constructor() {
    super()
    this.state = {
      isTrading: false,
      showCalendar: false,
    }
    this.tradingChange = this.tradingChange.bind(this)
    this.showCalendar = this.showCalendar.bind(this)
    this.closeCalendar = this.closeCalendar.bind(this)
  }

  componentDidMount() {
    this.props.loadShareholders()
    this.props.loadTransactions()
  }

  showCalendar() {
    this.setState({
      showCalendar: true
    })
  }

  closeCalendar() {
    this.setState({
      showCalendar: false
    })
  }

  tradingChange(e, { checked }) {
    this.setState({
      isTrading: checked,
    })
  }

  render() {
    const { loaded, token, transactions, shareholders, routeTo } = this.props

    const shareholdersWithData = shareholders.filter(
      shareholder => shareholder.firstName
    )

    const panes = [
      {
        menuItem: 'Shareholders',
        render: () =>
          shareholdersWithData.length ? (
            <ShareholdersTable
              shareholders={shareholders}
              routeTo={routeTo}
              token={token}
            />
          ) : (
            <Segment>No shareholder data available</Segment>
          )
      },
      {
        menuItem: 'Transactions',
        render: () =>
          transactions.length ? (
            <TransactionsTable transactions={transactions} shareholders={shareholders} />
          ) : (
            <Segment>No transactions have been made yet</Segment>
          )
      }
    ]

    const tradingOption = (
      <div className="trading">
        <TradingOptionLabel className="tradingOptionLabel">
          {' '}
          Trading: {this.state.isTrading ? 'Active' : 'Inactive'}{' '}
        </TradingOptionLabel>
        <Checkbox toggle onChange={this.tradingChange} />
        <img className="calendarIcon" src={calendarIcon} alt="Calendar" onClick={this.showCalendar} />
      </div>
    )

    return (
      <TokenDetailView>
        <Grid columns={1}>
          <Grid.Column>
            <TokenDetailHeader>
              {' '}
              Aboveboard Common Stock <img src={tokenIcon} alt="tokenIcon" />
            </TokenDetailHeader>
          </Grid.Column>
        </Grid>
        <Grid columns={2} className="typeBoards">
          <Grid.Column className="typeBoard" width={5} textAlign="center">
            <Image
              src={userGraphic}
              centered
              verticalAlign="middle"
              className="boardImage"
            />
            <TypeCountLabel> {shareholdersWithData.length} </TypeCountLabel>
            <TypeLabel> Shareholders </TypeLabel>
          </Grid.Column>
          <Grid.Column
            className="typeBoard"
            width={5}
            textAlign="center"
            style={{ marginLeft: 30 }}
          >
            <Image
              src={path}
              centered
              verticalAlign="middle"
              className="boardImage"
            />
            <TypeCountLabel> {transactions.length}+ </TypeCountLabel>
            <TypeLabel> Total Transactions </TypeLabel>
          </Grid.Column>
        </Grid>

        {!loaded ? (
          <span>
            Loading token details...<Icon name="spinner" loading />
          </span>
        ) : (
          <div className="TableContainer">
            {tradingOption}
            <Tab panes={panes} className="issuePanes" />
          </div>
        )}
        <Modal size={'small'} open={this.state.showCalendar} onClose={this.closeCalendar}>
          <Modal.Header>
            Select the date
          </Modal.Header>
          <Modal.Content>
            <p>Are you sure you want to modify the content?</p>
          </Modal.Content>
          <Modal.Actions>
            <Button negative onClick={this.closeCalendar}>
              No
            </Button>
            <Button positive icon='checkmark' labelPosition='right' content='Yes' />
          </Modal.Actions>
        </Modal>


      </TokenDetailView>
    )
  }
}

export default InvestorDetailView
import React, { Component } from 'react'
import { Modal, Button } from 'semantic-ui-react'
import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'
import { DateRangePicker } from 'react-dates'

class PauseTradingModal extends Component {
	constructor() {
		super()
    this.state = {
      startDate: null,
      endDate: null,
      focusedInput: null,
    }
	}

	render() {
		return(
      <Modal size={'small'} open={this.props.showCalendar} onClose={this.props.closeCalendar}>
        <Modal.Header>
          Select dates to pause trading
        </Modal.Header>
        <Modal.Content>
        <DateRangePicker
          startDate={this.state.startDate}
          startDateId='start_id'
          endDate={this.state.endDate}
          endDateId='end_id'
          onDatesChange={({ startDate, endDate }) => { this.setState({ startDate, endDate })}}
          focusedInput={this.state.focusedInput}
          onFocusChange={(focusedInput) => { this.setState({ focusedInput })}}
        />
        </Modal.Content>

        <Modal.Actions>
          <Button positive icon='checkmark' labelPosition='right' content='Done' onClick={this.props.closeCalendar} />
        </Modal.Actions>
      </Modal>
		)
	}
}

export default PauseTradingModal
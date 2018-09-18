import React from 'react'
import { reduxForm } from 'redux-form'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  Button,
  Container,
  Grid,
  Header,
  Label as OriginalLabel,
  Segment
} from 'semantic-ui-react'

import { Label, Text } from 'components/inputs'

const validate = values => {
  const errors = {}

  return errors
}

const RequestForQualifierForm = props => {
  const {
    handleSubmit,
    errors,
    pristine,
    submitting
  } = props

  return (
    <form onSubmit={handleSubmit}>
      <Container text>
        <Segment textAlign='center'>
          <Header as='h2' textAlign='center'>
            Edit Buyer
          </Header>
          <Grid stackable divided='vertically' columns={2}>
            <Grid.Row>
              <Grid.Column>
                <Label>First Name *</Label>
                <Text name='firstName' />
              </Grid.Column>
            </Grid.Row>
            { errors &&
              <Grid.Row>
                <Grid.Column width={16} textAlign='center'>
                  <Segment>
                    <OriginalLabel color='red'>{errors}</OriginalLabel>
                  </Segment>
                </Grid.Column>
              </Grid.Row>
            }
            <Grid.Row>
              <Grid.Column width={16} textAlign='center'>
                <Button type='submit' disabled={pristine || submitting}>
                  Save
                </Button>
                <Link to='/owners' className='ui button secondary'>
                  Cancel
                </Link>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </Container>
    </form>
  )
}

const Form = reduxForm({
  form: 'RequestForQualifier',
  validate,
  enableReinitialize: true
})(RequestForQualifierForm)

const mapStateToProps = (state, ownProps) => {
  return {
    initialValues: ownProps.investor,
    initialEthereumAddresses: ownProps.investor.ethAddresses,
    errors: state.wallet.error || (state.investor.isError || {}).message
  }
}

export default connect(mapStateToProps)(Form)

import React from 'react'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { Link } from 'react-router-dom'
import {
  Button,
  Container,
  Grid,
  Header,
  Label as OriginalLabel,
  Segment,
  Checkbox
} from 'semantic-ui-react'

import { Label, Text } from 'components/inputs'

const validate = values => {
  const errors = {}

  return errors
}

const CreateTokenForm = props => {
  const { handleSubmit, errors, pristine, submitting } = props

  return (
    <form onSubmit={handleSubmit}>
      <Container text>
        <Segment textAlign='center'>
          <Header as='h2' textAlign='center'>
            Launch New Token
          </Header>
          <br />
          <Grid stackable divided='vertically' columns={1}>
            <Grid.Row>
              <Grid.Column width={12}>
                <Label>Token Name *</Label>
                <Text name='firstName' />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={4}>
                <Label>Token Symbol *</Label>
                <Text name='firstName' />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={5}>
                <Checkbox label='Divisble' />
                <br />
                <br />
                <Label>Decimal Precision *</Label>
                <Text name='firstName' />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={5}>
                <Checkbox label="Launch Affiliate's Whitelist" />
              </Grid.Column>
            </Grid.Row>
            {errors ? (
              <Grid.Row>
                <Grid.Column width={16} textAlign='center'>
                  <Segment>
                    <OriginalLabel color='red'>{errors}</OriginalLabel>
                  </Segment>
                </Grid.Column>
              </Grid.Row>
            ) : (
              ''
            )}
            <Grid.Row>
              <Grid.Column width={16} textAlign='center'>
                <Button type='submit' disabled={pristine || submitting}>
                  Save
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Link to='/whitelisting' className='ui button secondary'>
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
  form: 'CreateToken',
  validate,
  enableReinitialize: true
})(CreateTokenForm)

const mapStateToProps = (state, ownProps) => {
  return {
    errors: state.wallet.error || (state.token.isError || {}).message
  }
}

export default connect(mapStateToProps)(Form)

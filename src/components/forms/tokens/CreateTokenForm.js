import React from 'react'
import { connect } from 'react-redux'
import { reduxForm, formValueSelector } from 'redux-form'
import { Link } from 'react-router-dom'
import {
  Button,
  Container,
  Grid,
  Header,
  Label as OriginalLabel,
  Segment
} from 'semantic-ui-react'

import { Checkbox, Label, Text } from 'components/inputs'

const validate = values => {
  const errors = {}

  return errors
}

const CreateTokenForm = props => {
  const { handleSubmit, errors, pristine, submitting, divisble } = props

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
                <Text name='name' />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={4}>
                <Label>Token Symbol *</Label>
                <Text name='symbol' />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={5}>
                <Label style={{ marginRight: '10px' }}>Divisible</Label>
                <Checkbox name='divisble' />
                { divisble && <br /> }
                { divisble && <br /> }
                { divisble && <Label>Decimal Precision *</Label> }
                { divisble && <Text name='precision' /> }
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={5}>
                <Label style={{ marginRight: '10px' }}>Launch Affiliate's Whitelist</Label>
                <Checkbox name='affiliates' />
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
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Link to='/tokens' className='ui button secondary'>
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

const selector = formValueSelector('CreateToken')
const mapStateToProps = (state, ownProps) => {
  return {
    errors: state.wallet.error || (state.token.isError || {}).message,
    divisble: selector(state, 'divisble')
  }
}

export default connect(mapStateToProps)(Form)

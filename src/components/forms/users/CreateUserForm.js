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
  Segment
} from 'semantic-ui-react'

import { Checkbox, Label, Text } from 'components/inputs'

const validate = values => {
  const errors = {}

  return errors
}

const CreateUserForm = props => {
  const { handleSubmit, errors, pristine, submitting } = props

  return (
    <form onSubmit={handleSubmit}>
      <Container text>
        <Segment textAlign='center'>
          <Header as='h2' textAlign='center'>
            Create User
          </Header>
          <Grid stackable divided='vertically' columns={1}>
            <Grid.Row>
              <Grid.Column>
                <Label>Google Account E-mail Address *</Label>
                <Text name='email' />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Label style={{ marginRight: '10px' }}>Admin</Label>
                <Checkbox name='admin' />
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
                <Link to='/users' className='ui button secondary'>
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
  form: 'CreateUser',
  validate,
  enableReinitialize: true
})(CreateUserForm)

const mapStateToProps = (state, ownProps) => {
  return {
    errors: state.wallet.error || (state.user.isError || {}).message
  }
}

export default connect(mapStateToProps)(Form)

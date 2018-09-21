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

import { Dropdown, Label, Text } from 'components/inputs'

const numberRegExp = /\d{1,3}/
const initialNumberRegexp = /[0-9,]+/

const validate = values => {
  const errors = {}

  if (!values.name) {
    errors.name = 'Token name is required'
  } else if (values.name.length > 255) {
    errors.name = 'Token name must be less than 256 characters'
  }

  if (!values.symbol) {
    errors.symbol = 'Symbol is required'
  } else if (values.symbol && values.symbol.length > 4) {
    errors.symbol = 'Symbol must be a maximum of 4 characters'
  }

  if (values.decimals && !numberRegExp.test(values.decimals)) {
    errors.decimals = 'Decimals must be between 1 and 999'
  }

  if (values.initialNumberRegexp && !initialNumberRegexp.test(values.initialNumberRegexp)) {
    errors.decimals = 'Initial number must be a valid non-decimal number'
  }

  if (!values.firstName) {
    errors.firstName = 'First name is required'
  } else if (values.firstName.length > 100) {
    errors.firstName = 'First name must be less than 100 characters'
  }

  if (!values.lastName) {
    errors.lastName = 'Last name is required'
  } else if (values.lastName.length > 100) {
    errors.lastName = 'Last name must be less than 100 characters'
  }

  return errors
}

const tokenTypeOptions = [
  {
    value: 'Aboveboard R-token RegD/RegS with governance',
    text: 'Aboveboard R-token RegD/RegS with governance'
  }
]

const sourceCodeUrlByTokenType = {
  'Aboveboard R-token RegD/RegS with governance': 'https://github.com/MaxosLLC/AboveboardSecurityToken'
}

const CreateTokenForm = props => {
  const { tokenType, handleSubmit, errors, pristine, submitting } = props

  return (
    <form onSubmit={handleSubmit}>
      <Container>
        <Segment textAlign='center'>
          <Header as='h2' textAlign='center'>
            Create a new Security Token
          </Header>
          <br />
          <Grid textAlign='center' stackable divided='vertically' columns={1}>
            <Grid.Row>
              <Grid.Column width={16}>
                <Label>Token Name *</Label>
                <Text name='name' />
              </Grid.Column>
              <Grid.Column width={6}>
                <Label>Token Symbol *</Label>
                <Text name='symbol' />
              </Grid.Column>
              <Grid.Column width={10}>
                <Label>Issue New Shares to My Account *</Label>
                <Text name='initialNumber' />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={16}>
                <Label>Token Format *</Label>
                <Dropdown name='type' options={tokenTypeOptions} initialValue='Aboveboard R-token RegD/RegS with governance' />
              </Grid.Column>
              <Grid.Column width={16}>
                <a href={sourceCodeUrlByTokenType[tokenType] || 'https://github.com/MaxosLLC/AboveboardSecurityToken'} target='_blank' rel='noopener noreferrer'>View the Source Code</a>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={8}>
                <Label>First Name *</Label>
                <Text name='firstName' />
              </Grid.Column>
              <Grid.Column width={8}>
                <Label>Last Name *</Label>
                <Text name='lastName' />
              </Grid.Column>
              <Grid.Column width={16}>
                <Label style={{ marginRight: '10px' }}>We will create a related affiliate whitelist</Label>
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
                  Create
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Link to='/securities' className='ui button secondary'>
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
  validate
})(CreateTokenForm)

const selector = formValueSelector('CreateToken')
const mapStateToProps = (state, ownProps) => {
  return {
    tokenType: selector(state, 'type'),
    initialValues: { initialNumber: '10,000,000' },
    errors: state.wallet.error || (state.localToken.isError || {}).message
  }
}

export default connect(mapStateToProps)(Form)

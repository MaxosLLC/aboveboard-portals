import React, { Fragment } from 'react'
import { reduxForm, FieldArray } from 'redux-form'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  Dropdown as DropdownForFieldArray,
  Button,
  Container,
  Grid,
  Header,
  Label as OriginalLabel,
  Segment,
  Icon
} from 'semantic-ui-react'

import { Dropdown, Label, Text } from 'components/inputs'
import countryOptions from 'data/dropDownCountryOptions'

const qualificationsOptions = [
  {
    text: 'US Accredited',
    value: 'us-accredited'
  },
  {
    text: 'US QIB',
    value: 'us-qib'
  }
]

const phoneRegexp = /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i; // eslint-disable-line
const postalAndZipCodeRegexp = /^[a-z0-9][a-z0-9\- ]{0,10}[a-z0-9]$/i

const validate = values => {
  const errors = {}

  if (!values.firstName) {
    errors.firstName = 'Required'
  } else if (values.firstName.length > 60) {
    errors.firstName = 'First name must be less than 60 characters'
  }

  if (!values.lastName) {
    errors.lastName = 'Required'
  } else if (values.lastName.length > 60) {
    errors.lastName = 'Last name must be less than 60 characters'
  }

  if (values.phone && !phoneRegexp.test(values.phone)) {
    errors.phone = 'Phone must be a valid phone number'
  }

  if (!values.addressLine1) {
    errors.addressLine1 = 'Required'
  } else if (values.addressLine1.length > 120) {
    errors.addressLine1 = 'Address must be less than 120 characters'
  }

  if (values.addressLine2 && values.addressLine2.length > 120) {
    errors.addressLine2 = 'Address must be less than 120 characters'
  }

  if (!values.city) {
    errors.city = 'Required'
  } else if (values.city.length > 60) {
    errors.city = 'City must be less than 60 characters'
  }

  if (values.state && values.state.length > 60) {
    errors.state = 'State must be less than 60 characters'
  }

  if (!values.country) {
    errors.country = 'Required'
  } else if (values.country.length > 60) {
    errors.country = 'Country must be less than 60 characters'
  }

  if (!values.zip) {
    errors.zip = 'Required'
  } else if (!postalAndZipCodeRegexp.test(values.zip)) {
    errors.zip = 'Zip/Postal Code code must be valid'
  }

  return errors
}

const renderwhitelistAddresses = ({
  initialWhitelists,
  whitelistOptions,
  fields,
  meta: { error, submitFailed }
}) => {
  const onChange = (e, data) => {
    fields.removeAll()
    data.value.forEach(address => {
      const name = data.options.find(option => option.value === address).text
      fields.push({ name, address })
    })
  }

  return (
    <Fragment>
      <Grid.Column style={{ padding: '10px' }}>
        <DropdownForFieldArray
          placeholder='Add Whitelist Address:'
          selection
          search
          multiple
          name='whitelists'
          options={whitelistOptions}
          onChange={onChange}
          defaultValue={initialWhitelists}
        />
        {submitFailed && error && <span>{error}</span>}
      </Grid.Column>
    </Fragment>
  )
}

const renderEthAddresses = ({
  initialEthereumAddresses,
  whitelistOptions,
  fields,
  meta: { error, submitFailed }
}) => (
  <Fragment>
    <Grid.Column style={{ margin: 'auto' }}>
      <Button type='button' key='submit' onClick={() => fields.push({})}>
        Add eth Address
      </Button>
      {submitFailed && error && <span>{error}</span>}
    </Grid.Column>
    {fields.map((ethAddress, index) => (
      <Grid
        key={`ethAddressGrid${index}`}
        padded='horizontally'
        celled
        stackable
        columns={2}
      >
        <Grid.Column key={`ethAddressColumn${index}`} width={16}>
          <Label style={{ padding: '10px' }}>ethAddress #{index + 1}</Label>
          <Icon
            name='trash outline'
            key={`ethAddressIcon${index}`}
            type='button'
            title='Remove ethAddress'
            size='large'
            onClick={() => fields.remove(index)}
          />
          <Text key={`ethAddressText${index}`} name={`${ethAddress}.address`} />
          <FieldArray
            key={`ethAddressFieldArray${index}`}
            name={`${ethAddress}.whitelists`}
            component={renderwhitelistAddresses}
            props={{ initialWhitelists: (initialEthereumAddresses[index] && initialEthereumAddresses[index].whitelists ? initialEthereumAddresses[index].whitelists : []).map(({ address }) => address), whitelistOptions }}
          />
        </Grid.Column>
      </Grid>
    ))}
  </Fragment>
)

let EditInvestorForm = props => {
  const {
    handleSubmit,
    errors,
    whitelists,
    initialEthereumAddresses,
    pristine,
    submitting
  } = props
  const whitelistOptions = whitelists.map(whitelist => {
    return {
      text: whitelist.name,
      value: whitelist.address
    }
  })
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
              <Grid.Column>
                <Label>Last Name *</Label>
                <Text name='lastName' />
              </Grid.Column>
              <Grid.Column>
                <Label>Email *</Label>
                <Text disabled name='email' />
              </Grid.Column>
              <Grid.Column>
                <Label>Phone</Label>
                <Text name='phone' />
              </Grid.Column>
              <Grid.Column>
                <Label>Address Line 1*</Label>
                <Text name='addressLine1' />
              </Grid.Column>
              <Grid.Column>
                <Label>Address Line 2</Label>
                <Text name='addressLine2' />
              </Grid.Column>
              <Grid.Column>
                <Label>City *</Label>
                <Text name='city' />
              </Grid.Column>
              <Grid.Column>
                <Label>State/Province</Label>
                <Text name='state' />
              </Grid.Column>
              <Grid.Column>
                <Label>Country *</Label>
                <Dropdown
                  selection
                  search
                  name='country'
                  options={countryOptions}
                />
              </Grid.Column>
              <Grid.Column>
                <Label>Zip/Postal Code *</Label>
                <Text name='zip' />
              </Grid.Column>
              <Grid.Column>
                <Label>Qualifications *</Label>
                <Dropdown
                  multiple
                  selection
                  search
                  name='qualifications'
                  options={qualificationsOptions}
                />
              </Grid.Column>
              <Grid.Column>
                <Label>Issues</Label>
                <Text name='issues' />
              </Grid.Column>
              <FieldArray
                name='ethAddresses'
                component={renderEthAddresses}
                props={{ initialEthereumAddresses, whitelistOptions }}
              />
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

// Decorate with reduxForm(). It will read the initialValues prop provided by connect()
EditInvestorForm = reduxForm({
  form: 'EditInvestor',
  validate,
  enableReinitialize: true
})(EditInvestorForm)

const mapStateToProps = (state, ownProps) => {
  return {
    initialValues: ownProps.investor,
    initialEthereumAddresses: ownProps.investor.ethAddresses,
    errors: state.wallet.error || (state.investor.isError || {}).message
  }
}
EditInvestorForm = connect(mapStateToProps)(EditInvestorForm)
export default EditInvestorForm

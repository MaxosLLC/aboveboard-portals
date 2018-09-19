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

import { Dropdown, Label, Text } from 'components/inputs'

const whitelistTypeOptions = [
  { value: 'KYC/AML Only', text: 'KYC/AML Only' },
  { value: 'US Accredited', text: 'US Accredited' },
  { value: 'Non-US Sophisticated', text: 'Non-US Sophisticated' },
  { value: 'Qualified Purchaser', text: 'Qualified Purchaser' },
  { value: 'QIB', text: 'QIB' },
  { value: 'Unregulated', text: 'Unregulated' },
  { value: 'Other', text: 'Other' }
]

const validate = values => {
  const errors = {}

  if (!values.name) {
    errors.name = 'Whitelist name is required'
  } else if (values.name.length > 255) {
    errors.name = 'Whitelist name must be less than 256 characters'
  }

  if (!values.type) {
    errors.type = 'Please select a whitelist type'
  }

  return errors
}

const CreateWhitelistForm = props => {
  const { handleSubmit, errors, pristine, submitting } = props

  return (
    <form onSubmit={handleSubmit}>
      <Container>
        <Segment textAlign='center'>
          <Header as='h2' textAlign='center'>
            Create Whitelist
          </Header>
          <Grid stackable divided='vertically' columns={1}>
            <Grid.Row>
              <Grid.Column>
                <Label>Whitelist Name *</Label>
                <Text name='name' />
              </Grid.Column>
              <Grid.Column>
                <Label>Qualification *</Label>
                <Dropdown
                  selection
                  search
                  name='type'
                  options={whitelistTypeOptions}
                />
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
  form: 'CreateWhitelist',
  validate,
  enableReinitialize: true
})(CreateWhitelistForm)

const mapStateToProps = (state, ownProps) => {
  return {
    errors: state.wallet.error || (state.whitelist.isError || {}).message
  }
}

export default connect(mapStateToProps)(Form)

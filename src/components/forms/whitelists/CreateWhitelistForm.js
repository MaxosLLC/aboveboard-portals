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
  { value: 'RegD', text: 'RegD' },
  { value: 'RegS', text: 'RegS' },
  { value: 'QIB', text: 'QIB' },
  { value: 'Accredited', text: 'Accredited' },
  { value: 'Sophisticated', text: 'Sophisticated' },
  { value: 'Unsophisticated', text: 'Unsophisticated' },
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
  const { handleSubmit, errors, pristine, submitting, localTokens } = props

  const localTokenOptions = localTokens.map(localToken => {
    return {
      value: localToken.address,
      text: localToken.name
    }
  })

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
                <Label>Type *</Label>
                <Dropdown
                  selection
                  search
                  name='type'
                  options={whitelistTypeOptions}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Label>Apply to Tokens *</Label>
                <Dropdown
                  selection
                  multiple
                  search
                  name='tokens'
                  options={localTokenOptions}
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
    localTokens: state.localToken.queryResult ? state.localToken.queryResult.data : [],
    errors: state.wallet.error || (state.whitelist.isError || {}).message
  }
}

export default connect(mapStateToProps)(Form)

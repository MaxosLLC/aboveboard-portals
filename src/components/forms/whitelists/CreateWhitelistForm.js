import React from 'react'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { Link } from 'react-router-dom'
import {
  Button,
  Container,
  Dropdown,
  Grid,
  Header,
  Label as OriginalLabel,
  Segment
} from 'semantic-ui-react'

import { Label, Text } from 'components/inputs'

const whitelistTypeOptions = [
  { value: 'RegD', text: 'RegD' },
  { value: 'RegS', text: 'RegS' },
  { value: 'QIB', text: 'QIB' },
  { value: 'Accredited', text: 'Accredited' },
  { value: 'Sophisticated', text: 'Sophisticated' },
  { value: 'Unsophisticated', text: 'Unsophisticated' }
]

const validate = values => {
  const errors = {}

  return errors
}

const CreateWhitelistForm = props => {
  const { handleSubmit, errors, pristine, submitting, tokens, localTokens } = props

  const localTokenOptions = localTokens.map(localToken => {
    const { address, name } = tokens.filter(({ address }) => address === localToken.address)[0]

    return {
      value: address,
      text: name
    }
  })

  return (
    <form onSubmit={handleSubmit}>
      <Container text>
        <Segment textAlign='center'>
          <Header as='h2' textAlign='center'>
            Create Whitelist
          </Header>
          <Grid stackable divided='vertically' columns={1}>
            <Grid.Row>
              <Grid.Column>
                <Label>Whitelist Name *</Label>
                <Text name='firstName' />
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
                  search
                  name='tokens'
                  options={localTokenOptions}
                />
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
})(CreateWhitelistForm)

const mapStateToProps = (state, ownProps) => {
  return {
    localTokens: state.localToken.queryResult ? state.localToken.queryResult.data : [],
    tokens: state.token.queryResult ? state.token.queryResult.data : [],
    errors: state.wallet.error || (state.token.isError || {}).message
  }
}

export default connect(mapStateToProps)(Form)

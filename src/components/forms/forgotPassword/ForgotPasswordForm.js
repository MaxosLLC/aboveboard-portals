import React from 'react'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { Icon } from 'semantic-ui-react'
import { Button, Text } from 'components/inputs'

const SigninForm = ({ handleSubmit, pristine, isSaving, errors }) => {
  return (
    <form onSubmit={handleSubmit}>
      <Text placeholder='E-mail Address' name='email' disabled={isSaving} />
      <br />
      { isSaving ? <div>Sending Forgot Password E-mail... <Icon loading name='spinner' /></div> : '' }
      { errors &&
        <div style={{ marginTop: '10px' }}><span className='error'>Error: {errors}</span></div>
      }
      <br />
      <Button type='submit' disabled={pristine || isSaving}>Sign Up</Button>
      <br />
      <br />
    </form>
  )
}

const Form = reduxForm({
  form: 'forgotPassword'
})(SigninForm)

const mapStateToProps = state => ({
  isSaving: state.currentUser.isSaving,
  errors: state.form && state.form.forgotPassword && state.form.forgotPassword.submitSucceeded && state.auth.isError && state.auth.isError.message
})

export default connect(mapStateToProps)(Form)

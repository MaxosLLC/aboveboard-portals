import React from 'react'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { Icon, Image } from 'semantic-ui-react'
import { Button, Text } from 'components/inputs'

const emailRegexp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,16}$/i

const validate = values => {
  const errors = {}

  if (!values.email) {
    errors.email = 'Required'
  } else if (!emailRegexp.test(values.email)) {
    errors.email = 'Invalid email address'
  } else if (values.email.length > 100) {
    errors.email = 'Email must be less than 100 characters'
  }

  return errors
}

const SigninForm = ({ handleSubmit, captchaImageData, captchaKey, changeCaptchaImage, pristine, isSaving, errors }) => {
  return (
    <form onSubmit={handleSubmit}>
      <Text placeholder='E-mail Address' name='email' disabled={isSaving} />
      <Text type='hidden' value={captchaKey} name='captchaKey' />
      <br />
      { captchaImageData ? <Image src={`data:image/png;base64,${captchaImageData}`} /> : null }
      <br />
      <Text placeholder='Captcha Value' name='captchaValue' disabled={isSaving} />
      { isSaving ? <div>Sending Signup E-mail... <Icon loading name='spinner' /></div> : '' }
      { errors &&
        <div style={{ marginTop: '10px' }}><span className='error'>Error: {errors}</span></div>
      }
      <br />
      <Button type='submit' disabled={pristine || isSaving}>Sign Up</Button>
      <Button type='button' onClick={changeCaptchaImage}>Change Image</Button>
      <br />
      <br />
    </form>
  )
}

const Form = reduxForm({
  form: 'signup',
  enableReinitialize: true,
  validate
})(SigninForm)

const mapStateToProps = (state, ownProps) => ({
  initialValues: {
    captchaKey: ownProps.captchaKey
  },
  isSaving: state.currentUser.isSaving,
  errors: state.form && state.form.signup && state.form.signup.submitSucceeded && state.auth.isError && state.auth.isError.message
})

export default connect(mapStateToProps)(Form)

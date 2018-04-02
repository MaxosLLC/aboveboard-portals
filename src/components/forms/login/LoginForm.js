import React from 'react'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { Icon } from 'semantic-ui-react'
import { Button, Checkbox, Label, Text } from 'components/inputs'

const SigninForm = ({ handleSubmit, pristine, isSaving, errors }) => {
  return (
    <form onSubmit={handleSubmit}>
      <Text placeholder="E-mail Address" name="email" disabled={isSaving} />
      <br />
      <Text
        placeholder="Password"
        name="password"
        type="password"
        disabled={isSaving}
      />
      <br />
      {!isSaving ? <Label style={{ margin: '10px' }}>Remember Me</Label> : ''}
      {!isSaving ? <Checkbox name="rememberMe" /> : ''}
      <br />
      {isSaving ? (
        <div>
          Logging in... <Icon loading name="spinner" />
        </div>
      ) : (
        ''
      )}
      {errors && (
        <div style={{ marginTop: '10px' }}>
          <span className="error">Error: {errors}</span>
        </div>
      )}
      <br />
      <Button type="submit" disabled={pristine || isSaving}>
        Log In
      </Button>
      <br />
      <br />
    </form>
  )
}

const Form = reduxForm({
  form: 'login',
})(SigninForm)

const mapStateToProps = state => ({
  isSaving: state.currentUser.isSaving,
  errors:
    state.form &&
    state.form.login &&
    state.form.login.submitSucceeded &&
    state.auth.isError &&
    state.auth.isError.message,
})

export default connect(mapStateToProps)(Form)

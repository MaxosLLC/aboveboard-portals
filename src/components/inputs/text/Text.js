import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'redux-form'
import { Input } from 'semantic-ui-react'

const CustomInput = ({
  input,
  meta: { touched, error },
  placeholder,
  mandatory,
  type,
  disabled
}) => {
  return (
    <div>
      {mandatory
      ? (
        <Input
          fluid
          placeholder={placeholder}
          type={type}
          label={{ icon: 'asterisk' }}
          labelPosition={'left corner'}
          onChange={input.onChange}
          value={input.value}
          {...input}
          disabled={disabled}
        />
      )
      : (
        <Input
          fluid
          placeholder={placeholder}
          type={type}
          onChange={input.onChange}
          value={input.value}
          {...input}
          disabled={disabled}
        />
      )}
      {touched && error && <span className='input__error'>{error}</span>}
    </div>
  )
}

CustomInput.propTypes = {
  input: PropTypes.object, // eslint-disable-line react/no-unused-prop-types
  meta: PropTypes.object,
  type: PropTypes.string,
  mandatory: PropTypes.bool,
  placeholder: PropTypes.string,
  defaultValue: PropTypes.string,
  disabled: PropTypes.bool
}

const Text = ({ name, type = 'text', mandatory = false, placeholder, disabled = false }) => {
  return (
    <div className='inputWrapper'>
      <Field
        name={name}
        type={type}
        component={CustomInput}
        mandatory={mandatory}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  )
}

Text.propTypes = {
  input: PropTypes.object, // eslint-disable-line react/no-unused-prop-types
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  mandatory: PropTypes.bool,
  placeholder: PropTypes.string,
  defaultValue: PropTypes.string
}

export default Text

import React from 'react'
import PropTypes from 'prop-types'
import { Button as ButtonWrapper } from 'semantic-ui-react'
import classnames from 'classnames'
import Label from 'components/inputs/label/Label'
import './Button.css'

const Button = ({ action = false, color, children, style = {}, ...props }) => {
  const classes = classnames({
    circular: action,
    action: action,
    'with-nav': action === 'nav',
  })

  return (
    <ButtonWrapper className={`${color} ${classes}`} {...props}>
      {children && (
        <Label type="input" style={style}>
          {children}
        </Label>
      )}
    </ButtonWrapper>
  )
}

Button.propTypes = {
  action: PropTypes.oneOf([false, true, 'nav']),
  color: PropTypes.oneOf([
    'brand',
    'salmon',
    'teal',
    'red',
    'green',
    'black',
    'gray',
    'white',
  ]),
  children: PropTypes.node,
  style: PropTypes.shape({}),
}

export default Button

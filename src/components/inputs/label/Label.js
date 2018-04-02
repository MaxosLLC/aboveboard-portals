import React from 'react'
import PropTypes from 'prop-types'

const Label = ({ type = 'default', children, style }) => {
  const renderDefaultLabel = () => <label style={style}>{children}</label>

  const renderInputLabel = () => (
    <div className="input" style={style}>
      {children}
    </div>
  )

  const labels = {
    default: renderDefaultLabel,
    input: renderInputLabel,
  }

  return labels[type]()
}

Label.propTypes = {
  type: PropTypes.oneOf(['default', 'input']),
  children: PropTypes.node,
}

export default Label

import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

const Checkbox = ({ id, name, style }) => {
  return (
    <Field
      className="checkbox"
      name={name}
      style={style}
      id={id || name}
      component="input"
      type="checkbox"
    />
  );
};

Checkbox.propTypes = {
  name: PropTypes.string,
};

export default Checkbox;

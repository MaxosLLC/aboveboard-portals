import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown as DropdownWrapper } from 'semantic-ui-react';
import { Field } from 'redux-form';

const CustomInput = initialValue => ({
  input: { value, onChange, onBlur },
  meta: { touched, error },
  options,
  multiple,
  search,
  selection,
}) => {
  return (
    <div>
      <DropdownWrapper
        fluid
        options={options}
        value={!value ? initialValue : value}
        onChange={(e, dropdown) => onChange(dropdown.value)}
        multiple={multiple}
        search={search}
        selection={selection}
      />
      {touched && error && <span className="input__error">{error}</span>}
    </div>
  );
};

CustomInput.propTypes = {
  input: PropTypes.object,
  options: PropTypes.array,
  multiple: PropTypes.bool,
  search: PropTypes.bool,
  selection: PropTypes.bool,
};

const Dropdown = ({
  name,
  options,
  multiple = false,
  search = false,
  selection = false,
  initialValue,
  defaultValue,
}) => (
  <Field
    className="dropdown"
    name={name}
    component={CustomInput(initialValue)}
    options={options}
    multiple={multiple}
    search={search}
    selection={selection}
  />
);
Dropdown.propTypes = {
  name: PropTypes.string,
  options: PropTypes.array,
  multiple: PropTypes.bool,
  search: PropTypes.bool,
  selection: PropTypes.bool,
};

export default Dropdown;

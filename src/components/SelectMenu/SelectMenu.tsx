import React from 'react';
import Select from 'react-select';
import './style.css';

export type DropdownOption = {
  value: string,
  label: string
}

const SelectMenu = (props):React.ReactElement => (
  <Select
    {...props}
    components={{
      IndicatorSeparator: () => null
    }}
    styles={{
      menu: (baseStyles, state) => ({
        ...baseStyles,
        boxShadow: 'rgb(145 158 171 / 70%) 0px 8px 24px -4px;'
      }),
      option: (baseStyles, state) => {
        let modification;
        if (state.isSelected) {
          modification = {
            color: '#fff',
            background: 'var(--button-primary)'
          };
        }
        return {
          ...baseStyles,
          color: 'var(--text-color)',
          ...modification
        };
      }
    }}
  />
);

export default SelectMenu;

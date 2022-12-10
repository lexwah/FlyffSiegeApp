import React from 'react';
import Select from 'react-select';
import './style.css';

interface DropdownItem {
  label: string,
  value: string,
  onSelect?: ()=> void
}

const Dropdown = ({ items }: {items: DropdownItem[]}): React.ReactElement => {
  const onChange = () => {
    // todo
  };

  return (
    <Select
      components={{
        IndicatorSeparator: () => null,
      }}
      styles={{
        control: (provided) => ({
          ...provided,
          borderRadius: '5px',
          color: 'var(--text-color)',
        }),
        singleValue: (provided) => ({
          ...provided,
          color: 'var(--text-color)',
        }),
      }}
      defaultValue={items[0]}
      isSearchable={false}
      isMulti={false}
      options={items}
      className="lx-dropdown-select"
    />
  );
};

export default Dropdown;

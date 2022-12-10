/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import './style.css';

const ToggleSwitch = ({
  id,
  className,
  isEnabled = false,
  isDisabled = false,
  onChange,
}: {
  onChange?: (isEnabled: boolean) => void,
  className?: string,
  id?: string,
  isEnabled?: boolean,
  isDisabled?: boolean
}): React.ReactElement => {
  const internalOnChange = (e) => {
    const checked = !!e.target.checked;
    if (onChange) {
      onChange(checked);
    }
  };

  return (
    <label
      className={`toggle-switch${isDisabled ? ' disabled' : ''}${className ? ` ${className}` : ''}`}
    >
      <input
        id={id}
        type="checkbox"
        onChange={internalOnChange}
        checked={isEnabled}
        disabled={isDisabled}
      />
      <span className="toggle-switch-slider" />
    </label>
  );
};

export default ToggleSwitch;

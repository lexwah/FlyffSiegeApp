import React from 'react';
import './style.css';

// todo attach more fields to this type
type Params = React.InputHTMLAttributes<HTMLInputElement>

const TextEntryDialogField = (props: Params): React.ReactElement => {
  const { className } = props;

  return (
    <input
      autoComplete="no"
      className={`text-entry-dialog-text${className ? ` ${className}` : ''}`}
      {...props}
    />
  );
};

export default TextEntryDialogField;

import React from 'react';
import './style.css';
import ModalDialog from '../ModalDialog/ModalDialog';
import ButtonRow from '../ButtonRow/ButtonRow';
import DialogButtons from '../DialogButtons/DialogButtons';
import TextEntryDialogField from '../TextEntryDialogField/TextEntryDialogField';

const TextEntryDialog = ({
  isPassword = false,
  onClose,
  title,
  description,
  placeholder
}: {
  title: string,
  description?: string,
  isPassword?: boolean,
  onClose: (text: string | null)=>void,
  placeholder?: string
}): React.ReactElement => {
  const [text, setText] = React.useState<string>('');

  const onChange = (e) => {
    const val = e.target.value;
    setText(val || '');
  };

  const cancel = () => {
    onClose(null);
  };

  const internalOnClose = () => {
    onClose(text);
  };

  return (
    <ModalDialog
      title={title}
      onClose={internalOnClose}
      className="text-entry-dialog"
    >

      {
        description && (
          <span className="text-entry-dialog-desc">
            {description}
          </span>
        )
      }

      <TextEntryDialogField
        placeholder={placeholder}
        autoComplete="no"
        type={isPassword ? 'password' : 'text'}
        className="text-entry-dialog-text"
        onChange={onChange}
      />

      <DialogButtons
        onCancel={cancel}
        onConfirm={internalOnClose}
      />
    </ModalDialog>
  );
};

export default TextEntryDialog;

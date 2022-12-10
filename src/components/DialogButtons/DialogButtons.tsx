import React from 'react';
import Button from '../Button/Button';
import ButtonRow from '../ButtonRow/ButtonRow';
import './style.css';

const DialogButtons = ({
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  onCancel,
  onConfirm,
}: {
  cancelText?: string,
  confirmText?: string,
  onCancel?: ()=> void,
  onConfirm: ()=> void
}): React.ReactElement => (
  <ButtonRow
    className="dialog-btns"
  >
    {
      onCancel && (
        <Button
          className="dialog-cancel"
          onClick={onCancel}
        >
          {cancelText}
        </Button>
      )
    }

    <Button
      onClick={onConfirm}
      className="dialog-confirm"
    >
      {confirmText}
    </Button>
  </ButtonRow>
);

export default DialogButtons;

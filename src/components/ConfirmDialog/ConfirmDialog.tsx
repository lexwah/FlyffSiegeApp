import React from 'react';
import { confirmable, createConfirmation } from 'react-confirm';
import DialogButtons from '../DialogButtons/DialogButtons';
import ModalDialog from '../ModalDialog/ModalDialog';
import './style.css';

interface ConfirmProps {
  show: boolean,
  proceed: (positive: boolean)=> void,
  confirmation: any,
  options: Record<string, any>
}

const ConfirmDialog = ({
  show,
  proceed,
  confirmation,
  options = {},
}: ConfirmProps) => (
  <ModalDialog
    className="confirm-dialog"
    title="Confirm action"
    onClose={() => { proceed(false); }}
  >
    {confirmation}
    <DialogButtons
      onCancel={() => { proceed(false); }}
      onConfirm={() => { proceed(true); }}
    />
  </ModalDialog>
);

const AlertDialog = ({
  show,
  proceed,
  confirmation,
  options = {},
}: ConfirmProps) => (
  <ModalDialog
    className="confirm-dialog"
    title={options.title || ''}
    onClose={() => { proceed(false); }}
  >
    {confirmation}
    <DialogButtons
      confirmText={options.confirmText || 'OK'}
      onConfirm={() => { proceed(true); }}
    />
  </ModalDialog>
);

const confirm = createConfirmation(confirmable(ConfirmDialog), 0);

const alert = createConfirmation(confirmable(AlertDialog), 0);

export {
  confirm, alert
};

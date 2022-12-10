import React from 'react';
import './style.css';
import { CloseOutlined } from '@ant-design/icons';
import IconButton from '../IconButton/IconButton';

const ModalDialog = ({
  title,
  children,
  onClose,
  className,
}: {
  title: string,
  children: React.ReactNode,
  onClose:()=>void,
  className?: string
}): React.ReactElement => (
  <div className="modal-overlay">
    <div className={`modal-dialog animated fadeInDown ${className ? ` ${className}` : ''}`}>
      <div className="modal-top">
        <h3 className="modal-title">{title}</h3>
        <IconButton onClick={onClose}>
          <CloseOutlined />
        </IconButton>
      </div>
      <div className="modal-content">
        {children}
      </div>
    </div>
  </div>
);

export default ModalDialog;

import React from 'react';
import './style.css';

const copyToClipboard = (text: string): void => {
  const copyArea = document.createElement('textarea');
  copyArea.classList.add('te-copy-area'); // append this class which essentially hides the textarea
  copyArea.value = text;
  document.body.appendChild(copyArea);
  copyArea.select();
  document.execCommand('copy');
  document.body.removeChild(copyArea);
};

const ShareBox = ({ text, className, onCopied }: {text: string, className?: string, onCopied?: ()=>void}): React.ReactElement => {
  const [isCopied, setIsCopied] = React.useState<boolean>(false);

  const onClick = () => {
    copyToClipboard(text);
    setIsCopied(true);
    if (onCopied) {
      onCopied();
    }
  };

  return (
    <div
      aria-label={`Click to copy the following text to the clipboard: ${text}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyUp={(e) => {
        if (e.key === 'Enter') {
          onClick();
        }
      }}
      className={`share-box${className ? ` ${className}` : ''}`}
    >
      <input
        type="text"
        className="share-input"
        disabled
        tabIndex={-1}
        value={text}
      />
      <div className="share-copy-btn">
        {isCopied ? 'Copied' : 'Copy'}
      </div>
    </div>
  );
};

export default ShareBox;

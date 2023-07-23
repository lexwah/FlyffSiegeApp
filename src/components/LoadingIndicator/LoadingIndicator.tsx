import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import './style.css';

enum IndicatorType {
  SPINNER = 'spinner',
  DOTS = 'dots'
}
const LoadingIndicator = ({
  type = IndicatorType.DOTS,
  style,
  className
}: {
  type?: IndicatorType,
  style?: React.CSSProperties,
  className?: string
}): React.ReactElement => {
  React.useEffect(() => {
    // load
  }, []);

  let elem;
  switch (type) {
    case IndicatorType.DOTS: {
      elem = <div className="dot-typing" />;
      break;
    }
    case IndicatorType.SPINNER: {
      elem = <LoadingOutlined />;
      break;
    }
    default: {
      elem = <div className="dot-typing" />;
      break;
    }
  }

  return (
    <div className="loading-indicator">
      {elem}
    </div>

  );
};

export default LoadingIndicator;

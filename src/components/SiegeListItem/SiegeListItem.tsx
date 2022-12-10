import React from 'react';
import dayjs from 'dayjs';
import { CrownFilled, StarFilled } from '@ant-design/icons';
import './style.css';
import { Link } from 'react-router-dom';
import { labelForServer, Siege } from '../../util/util';

const SiegeListItem = ({
  siege
}: {
  siege: Siege
}): React.ReactElement => (
  <Link to={`/siege/${siege.siegeId}`} className="sl-item">
    <div className="sl-item-left">
      <span className="sl-item-server">
        <span className="sl-item-label">Server:</span>
        {' '}
        { siege.server ? labelForServer(siege.server) : 'Unspecified'}
      </span>
      <span className="sl-item-date-submitted">
        <span className="sl-item-label">Date submitted: </span>
        <span className="sl-item-val">
          {dayjs(siege.dateSubmitted).format('D MMM, YYYY')}
        </span>
      </span>
      <span className="sl-item-siege-date">
        <span className="sl-item-label">Date of Siege: </span>
        <span className="sl-item-val">
          {siege.siegeDate ? dayjs(siege.siegeDate).format('D MMM, YYYY') : 'Unknown'}
        </span>
      </span>
    </div>
    <div className="sl-item-right">
      <span className="sl-item-winner">
        <CrownFilled title="Winning guild" className="sl-item-icon" />
        {' '}
        <span className="sl-item-winner-val">{siege.winner}</span>
      </span>
      <span className="sl-item-winner">
        <StarFilled title="MVP" className="sl-item-icon" />
        {' '}
        <span className="sl-item-mvp-val">{siege.mvp}</span>
      </span>
    </div>
  </Link>
);

export default SiegeListItem;

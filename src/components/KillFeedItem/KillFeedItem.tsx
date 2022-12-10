import React from 'react';
import './style.css';
import { CaretRightOutlined } from '@ant-design/icons';
import { Player, PointGain } from '../../LogParser/models';

const KillFeedItem = ({
  killer, target, pointGain, isDeath
}: {
  killer: Player, target: Player, pointGain?: PointGain, isDeath: boolean
}): React.ReactElement => (
  <div className="kf-item">
    <span className={`kf-killer${isDeath ? ' bad' : ' good'}`}>
      [
      {killer.guild}
      ]
      {' '}
      {killer.name}
    </span>
    <CaretRightOutlined className="kf-icon" />
    <span className={`kf-target${isDeath ? ' good' : ' bad'}`}>
      [
      {target.guild}
      ]
      {' '}
      {target.name}
    </span>
    <span className="kf-points">
      (+
      {pointGain?.total}
      )
    </span>
  </div>
);

export default KillFeedItem;

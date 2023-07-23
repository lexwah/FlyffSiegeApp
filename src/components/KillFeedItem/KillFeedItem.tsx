import React from 'react';
import './style.css';
import { CaretRightOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { BonusPointType, Player, PointGain } from '../../LogParser/models';
import { formatTimestamp, labelForKillBonus } from '../../util/util';

const KillFeedItem = ({
  killer, target, pointGain, isDeath, timeStamp
}: {
  killer: Player, target: Player, pointGain?: PointGain, isDeath: boolean, timeStamp?: string
}): React.ReactElement => {
  const bonuses = pointGain.bonusTypes?.map((bonus, index) => {
    let bClass;
    switch (bonus) {
      case BonusPointType.DEFENDER:
        bClass = 'defender';
        break;

      case BonusPointType.RESURRECTING:
        bClass = 'ress';
        break;

      case BonusPointType.SHUTDOWN:
        bClass = 'shutdown';
        break;
      case BonusPointType.UNKNOWN:
        bClass = 'unknown';
        break;

      default: bClass = 'unknown';
        break;
    }
    return (
      <div key={`kill-bonus-${index}`} className={`kill-bonus ${bClass}`}>
        {`${labelForKillBonus(bonus)} bonus`}
      </div>
    );
  }) || null;

  return (
    <div className="kf-item">
      {
        timeStamp && (
          <span className="kf-time">
            <ClockCircleOutlined className="kf-time-icon" />
            {' '}
            {formatTimestamp(timeStamp)}
          </span>
        )
      }
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
      <div className="kf-bonuses">
        {bonuses}
      </div>
    </div>
  );
};

export default KillFeedItem;

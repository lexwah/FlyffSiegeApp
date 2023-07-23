import React from 'react';
import { DeleteFilled, YoutubeFilled } from '@ant-design/icons';
import { Vod } from '../../LogParser/models';
import './style.css';

const VodTile = ({ vod, onVodDeleteClicked }: {
  vod: Vod,
  onVodDeleteClicked: (vod: Vod)=>void
}): React.ReactElement => (
  <a target="_blank" href={`https://www.youtube.com/watch?v=${vod.youtubeId}`} className="vod-tile" rel="noreferrer">
    <div
      className="delete-vod"
      role="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onVodDeleteClicked(vod);
      }}
      tabIndex={0}
      onKeyUp={(e) => { if (e.key === 'Enter') { onVodDeleteClicked(vod); } }}
    >
      <DeleteFilled />
    </div>
    <img
      className="vod-thumb"
      src={`https://img.youtube.com/vi/${vod.youtubeId}/hqdefault.jpg`}
      alt="Video thumbnail"
    />
    <div className="vod-yt-icon">
      <YoutubeFilled />
    </div>
    <div className="vod-title">{vod.title || 'Unspecified player'}</div>
  </a>
);

export default VodTile;

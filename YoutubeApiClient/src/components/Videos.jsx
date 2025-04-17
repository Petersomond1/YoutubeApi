import React from 'react';
import { ChannelCard, VideoCard } from './index';
// import { fetchFromAPI } from '../utils/fetchFromAPI';
import "../index.css";
import Loader from './Loader';


function Videos ({videos, 
   direction
}) {
  if (!videos?.length) return <Loader />;

  return (
    <div className="videos1" style={{ direction: direction || 'row' }}>
      {videos.map((item, idx) => (
        <div key={idx}>
          {item.id.videoId && <VideoCard video={item} />}
          {item.id.channelId && <ChannelCard channelDetail={item} />}
        </div>
      ))}
    </div>
  );
}
 export default Videos


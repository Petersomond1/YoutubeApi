import React from "react";
import { ChannelCard, VideoCard } from "./index";
import "../index.css";
import Loader from "./Loader";

function Videos({ videos, direction }) {
  if (!videos?.length) return <Loader />;

  return (
    <div className="videos1" style={{ flexDirection: direction || "row" }}>
      {videos.map((item, index) => {
        console.log("Item:", item); // Debug log to verify structure
        
        // Handle both YouTube and database videos
        const videoId = item.id;
        const channelTitle = item.channelTitle; // Only YouTube videos have this
        
        return (
          <div key={`${item.source}_${videoId}_${index}`}>
            {/* Always render VideoCard for all videos */}
            <VideoCard video={item} />
            
            {/* Only render ChannelCard for YouTube videos that have channelTitle */}
            {item.source === 'youtube' && channelTitle && (
              <ChannelCard channelDetail={{ ...item, channelTitle }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Videos;



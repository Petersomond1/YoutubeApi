//  youtubefront\src\components\ChannelDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../index.css";
import { Videos, ChannelCard } from ".";
import { fetchFromAPI } from "../utils/fetchFromAPI";

function ChannelDetail() {
  const [channelDetail, setChannelDetail] = useState(null);
  const [videos, setVideos] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchResults = async () => {
      const channelData = await fetchFromAPI(`channels/${id}`);
      setChannelDetail(channelData);

      const videosData = await fetchFromAPI(`search?channelId=${id}`);
      setVideos(videosData.videos);
    };

    fetchResults();
  }, [id]);

  return (
    <div className="channelDetailbox">
      <div>
        <div className="channelDetailchannelCard">
          {channelDetail && <ChannelCard channelDetail={channelDetail} />}
        </div>
      </div>

      <div className="channelDetailvideos">
        <Videos videos={videos} />
      </div>
    </div>
  );
}

export default ChannelDetail;
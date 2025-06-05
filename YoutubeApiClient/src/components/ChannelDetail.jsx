// YoutubeApiClient/src/components/ChannelDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../index.css";
import { Videos, ChannelCard } from ".";
import { fetchFromAPI } from "../utils/fetchFromAPI";

function ChannelDetail() {
  const [channelDetail, setChannelDetail] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);

        // Updated to match your backend API structure
        // First get channel details
        const channelData = await fetchFromAPI(`channels?channelId=${id}`);
        
        if (channelData.success && channelData.channelDetails) {
          setChannelDetail(channelData.channelDetails);
        }

        // Then get channel videos using search endpoint
        const videosData = await fetchFromAPI(`search?channelId=${id}&maxResults=50`);
        
        if (videosData.success) {
          // Combine YouTube and database videos
          const allVideos = [
            ...(videosData.youtubeVideos || []),
            ...(videosData.dbVideos || [])
          ];
          setVideos(allVideos);
        }

      } catch (error) {
        console.error("Error fetching channel data:", error);
        setError(error.message || "Failed to load channel data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchResults();
    }
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: "20px", color: "white", textAlign: "center" }}>
        <p>Loading channel details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", color: "red", textAlign: "center" }}>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="channelDetailbox">
      <div>
        <div className="channelDetailchannelCard">
          {channelDetail && <ChannelCard channelDetail={channelDetail} />}
        </div>
      </div>

      <div className="channelDetailvideos">
        {videos.length > 0 ? (
          <>
            <h5 style={{ color: "white", marginBottom: "15px", textAlign: "center" }}>
              Channel Videos ({videos.length})
            </h5>
            <Videos videos={videos} />
          </>
        ) : (
          <p style={{ color: "white", textAlign: "center" }}>
            No videos found for this channel
          </p>
        )}
      </div>
    </div>
  );
}

export default ChannelDetail;
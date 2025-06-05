// YoutubeApiClient/src/components/ChannelCard.jsx
import React from "react";
import { FaRegCheckCircle } from "react-icons/fa";
import "../index.css";
import { Link } from "react-router-dom";

const ChannelCard = ({ channelDetail = {}, marginTop }) => {
  // Handle both YouTube API response and your custom response structures
  const channelTitle = channelDetail.channelTitle || 
                      channelDetail.snippet?.title || 
                      channelDetail.title || 
                      "Unknown Channel";
  
  const channelId = channelDetail.channelId || 
                   channelDetail.id?.channelId || 
                   channelDetail.id || 
                   channelDetail.snippet?.channelId;

  const thumbnail = channelDetail.thumbnail || 
                   channelDetail.snippet?.thumbnails?.high?.url || 
                   channelDetail.snippet?.thumbnails?.default?.url;

  const subscriberCount = channelDetail.subscriberCount || 
                         channelDetail.statistics?.subscriberCount;

  if (!channelTitle) {
    console.warn("Invalid channel data:", channelDetail);
    return null; // Skip rendering if data is invalid
  }

  return (
    <div
      style={{
        boxShadow: "none",
        borderRadius: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: window.innerWidth <= 768 ? "356px" : "320px",
        height: "326px",
        margin: "auto",
        marginTop,
      }}
    >
      <Link to={`/channel/${channelId || channelTitle}`}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            textAlign: "center",
            color: "#fff",
          }}
        >
          {thumbnail && (
            <img
              src={thumbnail}
              alt={channelTitle || "Channel Thumbnail"}
              style={{
                borderRadius: "50%",
                height: "180px",
                width: "180px",
                marginBottom: "2px",
                border: "1px solid #e3e3e3",
                objectFit: "cover",
              }}
            />
          )}
          <h6>
            {channelTitle}{" "}
            <FaRegCheckCircle
              style={{ fontSize: "14px", color: "gray", marginLeft: "5px" }}
            />
          </h6>
          {subscriberCount && (
            <p style={{ color: "#aaa", fontSize: "12px", marginTop: "5px" }}>
              {parseInt(subscriberCount).toLocaleString()} subscribers
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ChannelCard;
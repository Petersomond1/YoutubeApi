import { Link } from "react-router-dom";
import { FaRegCheckCircle } from "react-icons/fa";
import {
  demoThumbnailUrl,
  demoVideoUrl,
  demoVideoTitle,
  demoChannelUrl,
  demoChannelTitle,
} from "../utils/Constants";
import "../index.css";

const VideoCard = ({ video }) => {
  if (!video) return null;

  // Extract video properties with fallbacks
  const { 
    id: videoId, 
    title, 
    thumbnail, 
    channelTitle, 
    source,
    format,
    publishedAt 
  } = video;

  // Create proper video link based on source
  const getVideoLink = () => {
    if (!videoId) return demoVideoUrl;
    return `/video/${videoId}`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div
      className="Videocard1"
      style={{
        width: "320px",
        boxShadow: "none",
        borderRadius: "0",
        position: "relative",
        marginBottom: "20px"
      }}
    >
      {/* Thumbnail Section */}
      <div className="videocard2" style={{ position: "relative" }}>
        <Link to={getVideoLink()}>
          <img
            src={thumbnail || demoThumbnailUrl}
            alt={title || "Video Thumbnail"}
            style={{ 
              height: "180px", 
              width: "358px", 
              objectFit: "cover",
              borderRadius: "8px"
            }}
            onError={(e) => {
              e.target.src = demoThumbnailUrl;
            }}
          />
        </Link>
        
        {/* Source Badge */}
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          backgroundColor: source === 'youtube' ? '#FF0000' : '#FC1503',
          color: 'white',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '10px',
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }}>
          {source === 'youtube' ? 'YT' : 'UP'}
        </div>

        {/* Format badge for uploaded videos */}
        {source === 'database' && format && (
          <div style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: 'bold'
          }}>
            {format.toUpperCase()}
          </div>
        )}
      </div>

      {/* Video Info Section */}
      <div className="videocard3" style={{ height: "auto", padding: "8px 0" }}>
        {/* Title */}
        <div style={{ marginBottom: "8px" }}>
          <span style={{ fontWeight: "bold", color: "#FFF", fontSize: "14px" }}>
            <Link 
              to={getVideoLink()}
              style={{ 
                color: "#FFF", 
                textDecoration: "none",
                display: "block",
                lineHeight: "1.3"
              }}
            >
              {title?.slice(0, 60) || demoVideoTitle.slice(0, 60)}
              {(title?.length > 60 || demoVideoTitle.length > 60) && "..."}
            </Link>
          </span>
        </div>

        {/* Channel Info - Only for YouTube videos */}
        {source === 'youtube' && (
          <div style={{ marginBottom: "4px" }}>
            <span style={{ fontWeight: "lighter", color: "gray", fontSize: "12px" }}>
              <Link 
                to={channelTitle ? `/channel/${channelTitle}` : demoChannelUrl}
                style={{ color: "gray", textDecoration: "none" }}
              >
                {channelTitle?.slice(0, 30) || demoChannelTitle.slice(0, 30)}
                {(channelTitle?.length > 30 || demoChannelTitle.length > 30) && "..."}
              </Link>
              <FaRegCheckCircle
                style={{ 
                  fontSize: "12px", 
                  color: "gray", 
                  marginLeft: "5px",
                  verticalAlign: "middle"
                }}
              />
            </span>
          </div>
        )}

        {/* Upload Date */}
        {publishedAt && (
          <div style={{ fontSize: "11px", color: "#aaa" }}>
            {source === 'youtube' ? 'Published' : 'Uploaded'}: {formatDate(publishedAt)}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCard;
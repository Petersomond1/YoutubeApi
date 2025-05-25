import React from "react";
import ReactPlayer from "react-player";

const VideoPlayer = ({ video }) => {
  if (!video) {
    return <p style={{ color: "white" }}>No video data available.</p>;
  }

  const { id, videoUrl, title, source, fileType } = video;

  console.log("VideoPlayer received video:", video); // Debug log

  const getVideoUrl = () => {
    if (source === 'youtube') {
      // For YouTube videos, use the embed URL or construct from ID
      return videoUrl || `https://www.youtube.com/watch?v=${id}`;
    } else if (source === 'database') {
      // For database videos, use the direct S3 URL
      return videoUrl;
    }
    return null;
  };

  const playerUrl = getVideoUrl();

  if (!playerUrl) {
    return (
      <div style={{ width: "100%", position: "sticky", top: "86px" }}>
        <div style={{ 
          height: "400px", 
          backgroundColor: "#1a1a1a", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          borderRadius: "8px"
        }}>
          <p style={{ color: "white" }}>Unable to play this video - No URL available.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", position: "sticky", top: "86px" }}>
      {source === 'database' ? (
        // For database/S3 videos, use HTML5 video player for better compatibility
        <div style={{ width: "100%", height: "400px", backgroundColor: "black", borderRadius: "8px" }}>
          <video
            width="100%"
            height="400px"
            controls
            style={{ borderRadius: "8px" }}
            onError={(e) => {
              console.error("Video failed to load:", e);
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          >
            <source src={playerUrl} type={fileType || 'video/mp4'} />
            <source src={playerUrl} type="video/webm" />
            <source src={playerUrl} type="video/ogg" />
            Your browser does not support the video tag.
          </video>
          <div style={{ 
            display: 'none', 
            color: 'white', 
            textAlign: 'center', 
            padding: '20px',
            backgroundColor: '#1a1a1a',
            borderRadius: '8px'
          }}>
            <p>Video format not supported by your browser.</p>
            <a href={playerUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#FC1503' }}>
              Download Video
            </a>
          </div>
        </div>
      ) : (
        // For YouTube videos, use ReactPlayer
        <div style={{ width: "100%", height: "400px" }}>
          <ReactPlayer 
            url={playerUrl}
            className="react-player"
            controls
            width="100%"
            height="400px"
            config={{
              youtube: {
                playerVars: {
                  showinfo: 1,
                  controls: 1,
                  modestbranding: 1,
                  rel: 0
                }
              }
            }}
            onError={(error) => {
              console.error("ReactPlayer error:", error);
            }}
          />
        </div>
      )}
      
      {/* Video Title */}
      <div style={{ 
        color: "#fff", 
        fontWeight: "bold", 
        padding: "10px 2px",
        fontSize: "16px",
        lineHeight: "1.3"
      }}>
        {title || "Untitled Video"}
        
        {/* Source indicator */}
        <span style={{
          marginLeft: "10px",
          fontSize: "12px",
          backgroundColor: source === 'youtube' ? '#FF0000' : '#FC1503',
          color: 'white',
          padding: '2px 6px',
          borderRadius: '4px',
          fontWeight: 'normal'
        }}>
          {source === 'youtube' ? 'YouTube' : 'Uploaded'}
        </span>
      </div>
    </div>
  );
};

export default VideoPlayer;
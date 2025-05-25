import React, { useEffect, useState } from "react";
import "../index.css";
import { useParams, Link } from "react-router-dom";
import { fetchFromAPI } from "../utils/fetchFromAPI";
import { FaCheckCircle } from "react-icons/fa";
import { Videos, Loader } from ".";
import VideoPlayer from "./VideoPlayer";

function VideoDetail() {
  const [videoDetail, setVideoDetail] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  // Determine source from ID format
  const getSourceAndId = (urlId) => {
    if (urlId.startsWith('db_')) {
      return { source: 'database', id: urlId };
    } else {
      return { source: 'youtube', id: urlId };
    }
  };

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const { source, id: videoId } = getSourceAndId(id);
        
        // Use the new unified endpoint
        const data = await fetchFromAPI(`video/${videoId}?source=${source}`);
        console.log("Video data:", data);
        if (!data.success) {
          throw new Error(data.error || "Failed to fetch video");
        }

        setVideoDetail(data.video);
        setRelatedVideos(data.relatedVideos || []);

      } catch (error) {
        console.error("Error fetching video details:", error);
        setError(error.message || "Failed to load video");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVideoDetails();
    }
  }, [id]);

  // Format numbers for display
  const formatNumber = (num) => {
    if (!num) return "0";
    const number = parseInt(num);
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + "M";
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + "K";
    }
    return number.toLocaleString();
  };

  if (loading) return <Loader />;
  
  if (error) {
    return (
      <div style={{ minHeight: "95vh", color: "white", padding: "20px" }}>
        <div>Error: {error}</div>
      </div>
    );
  }

  if (!videoDetail) return <Loader />;

  const { 
    title, 
    channelTitle, 
    channelId, 
    viewCount, 
    likeCount, 
    source,
    description,
    publishedAt,
    format,
    size
  } = videoDetail;

  return (
    <div style={{ minHeight: "95vh" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          "@media (min-width: 768px)": { flexDirection: "row" },
        }}
      >
        <div style={{ flex: 1 }}>
          {/* Video Player */}
          <VideoPlayer video={videoDetail} />

          {/* Video Title */}
          <div style={{ padding: "15px 2px 10px 2px" }}>
            <h1 style={{ 
              color: "#fff", 
              fontSize: "18px", 
              fontWeight: "bold",
              margin: "0",
              lineHeight: "1.3"
            }}>
              {title}
            </h1>
          </div>

          {/* Video Stats and Channel Info */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              color: "#fff",
              paddingTop: "1px",
              paddingLeft: "2px",
              paddingRight: "2px",
              flexWrap: "wrap",
              gap: "10px"
            }}
          >
            {/* Channel Info - Only for YouTube */}
            {source === 'youtube' && channelTitle && channelId && (
              <Link to={`/channel/${channelId}`} style={{ textDecoration: "none" }}>
                <p style={{ 
                  fontSize: "small", 
                  color: "#fff", 
                  margin: "0",
                  display: "flex",
                  alignItems: "center"
                }}>
                  {channelTitle}
                  <FaCheckCircle
                    style={{
                      fontSize: "12px",
                      color: "gray",
                      marginLeft: "5px",
                    }}
                  />
                </p>
              </Link>
            )}

            {/* Video Stats */}
            <div
              style={{ 
                display: "flex", 
                gap: "20px", 
                alignItems: "center",
                flexWrap: "wrap"
              }}
            >
              {/* YouTube Stats */}
              {source === 'youtube' && (
                <>
                  {viewCount && (
                    <p style={{ opacity: 0.7, margin: "0", fontSize: "14px" }}>
                      {formatNumber(viewCount)} views
                    </p>
                  )}
                  {likeCount && (
                    <p style={{ opacity: 0.7, margin: "0", fontSize: "14px" }}>
                      {formatNumber(likeCount)} likes
                    </p>
                  )}
                </>
              )}

              {/* Database Video Stats */}
              {source === 'database' && (
                <>
                  {format && (
                    <p style={{ opacity: 0.7, margin: "0", fontSize: "14px" }}>
                      Format: {format.toUpperCase()}
                    </p>
                  )}
                  {size && (
                    <p style={{ opacity: 0.7, margin: "0", fontSize: "14px" }}>
                      Size: {(size / (1024 * 1024)).toFixed(1)} MB
                    </p>
                  )}
                </>
              )}

              {publishedAt && (
                <p style={{ opacity: 0.7, margin: "0", fontSize: "14px" }}>
                  {source === 'youtube' ? 'Published' : 'Uploaded'}: {new Date(publishedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          {description && (
            <div style={{ 
              padding: "15px 2px", 
              color: "#ccc",
              borderTop: "1px solid #333",
              marginTop: "15px"
            }}>
              <h3 style={{ color: "#fff", fontSize: "16px", marginBottom: "10px" }}>
                Description
              </h3>
              <p style={{ 
                lineHeight: "1.6", 
                fontSize: "14px",
                whiteSpace: "pre-wrap"
              }}>
                {description}
              </p>
            </div>
          )}
        </div>

        {/* Related Videos Sidebar */}
        <div
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: "2px",
            paddingTop: "5px",
            "@media (min-width: 768px)": { paddingTop: "1px" },
            minWidth: "300px"
          }}
        >
          {relatedVideos.length > 0 && (
            <>
              <h3 style={{ color: "#fff", fontSize: "16px", marginBottom: "15px", paddingLeft: "10px" }}>
                Related Videos
              </h3>
              <Videos videos={relatedVideos} direction="column" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default VideoDetail;
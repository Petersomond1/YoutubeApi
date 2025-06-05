import React, { useEffect, useState } from "react";
import "../index.css";
import Sidebar from "./Sidebar";
import Videos from "./Videos";
import { fetchFromAPI } from "../utils/fetchFromAPI";

function Feed() {
  const [selectedCategory, setSelectedCategory] = useState("New");
  const [allVideos, setAllVideos] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchVideos = async (pageToken = "") => {
    try {
      setLoading(true);
      
      // Use the updated endpoint structure
      const data = await fetchFromAPI(`all?category=${selectedCategory}&pageToken=${pageToken}`);
      
      if (!data.success) {
        throw new Error(data.error || "Failed to fetch videos");
      }

      if (pageToken) {
        // If it's pagination, append only new YouTube videos (database videos don't paginate)
        setAllVideos((prev) => [
          ...prev.filter(video => video.source === 'database'), // Keep existing database videos
          ...prev.filter(video => video.source === 'youtube'), // Keep existing YouTube videos
          ...(data.youtubeVideos || []) // Add new YouTube videos
        ]);
      } else {
        // If it's a fresh fetch, replace all videos
        setAllVideos(data.videos || []);
      }

      console.log("@feed Fetched all videos:", data.videos);
      console.log("@feed YouTube count:", data.youtubeCount);
      console.log("@feed Database count:", data.databaseCount);
      setNextPageToken(data.nextPageToken);
      setError(null);
    } catch (error) {
      console.error("Error fetching videos:", error);
      setError("Failed to fetch videos. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Reset and fetch videos when category changes
  useEffect(() => {
    setAllVideos([]);
    setNextPageToken(null);
    fetchVideos();
  }, [selectedCategory]);

  return (
    <div className="feed1">
      <div className="feed2">
        <Sidebar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <p className="copyright">Copyright © 2024 Youtube_Atlanta Media</p>
      </div>
      <div
        className="feed3"
        style={{ overflowY: "auto", height: "90vh", flex: 2 }}
      >
        <h4 className="feed4" style={{ color: "white" }}>
          {selectedCategory} <span style={{ color: "#FC1503" }}>videos</span>
        </h4>
        
        {loading && !allVideos.length && (
          <p style={{ color: "white", marginLeft: "100px" }}>Loading videos...</p>
        )}
        
        {error ? (
          <p style={{ color: "red", marginLeft: "100px" }}>{error}</p>
        ) : (
          <>
            <Videos videos={allVideos} />
            
            {/* Load More Button (if there are more YouTube videos to load) */}
            {nextPageToken && !loading && (
              <div style={{ textAlign: "center", margin: "20px" }}>
                <button
                  onClick={() => fetchVideos(nextPageToken)}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#FC1503",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "16px"
                  }}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Load More YouTube Videos"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Feed;
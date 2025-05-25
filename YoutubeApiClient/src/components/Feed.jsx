//  youtubefront\src\components\Feed.jsx
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
      const data = await fetchFromAPI(`all?category=${selectedCategory}&pageToken=${pageToken}`);
      
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch videos");
      }

      if (pageToken) {
        // If it's pagination, append only new YouTube videos (database videos don't paginate)
        setAllVideos((prev) => [
          ...prev.filter(video => video.source === 'database'), // Keep existing database videos
          ...prev.filter(video => video.source === 'youtube'), // Keep existing YouTube videos
          ...data.youtubeVideos // Add new YouTube videos
        ]);
      } else {
        // If it's a fresh fetch, replace all videos
        setAllVideos(data.videos || []);
      }

      console.log("@feed Fetched all videos:", data.videos);
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
        {error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <>
            <Videos videos={allVideos} />
            
          </>
        )}
      </div>
    </div>
  );
}


export default Feed;


import React, { useEffect, useState } from "react";
import "../index.css";
import { fetchFromAPI } from "../utils/fetchFromAPI";
import Sidebar from './Sidebar';
import Videos from './Videos';

function Feed() {
  const [selectedCategory, setSelectedCategory] = useState("New");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);  // For loading state

  useEffect(() => {
    setLoading(true); // Start loading when the category changes

    // Fetch YouTube and S3 data in parallel
    Promise.all([
      fetchFromAPI(`youtube/${selectedCategory}`),  // Fetch from YouTube API
      fetchFromAPI(`s3/${selectedCategory}`),      // Fetch from AWS S3
    ])
      .then(([youtubeData, s3Data]) => {
        // Combine both results (YouTube and S3)
        const combinedVideos = [
          ...(youtubeData.items || []),  // YouTube videos
          ...(s3Data.Contents || []),    // S3 media
        ];
        setVideos(combinedVideos);
        setLoading(false);  // Set loading to false when done
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);  // Stop loading even if there's an error
      });
  }, [selectedCategory]);

  if (loading) {
    return <div>Loading...</div>;  // Display loading message while fetching data
  }

  return (
    <div className="feed1">
      <div className="feed2">
        <Sidebar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        <p className="copyright">
          Copyright © 2024 Youtube_Petersomond Media
        </p>
      </div>
      <div className="feed3" style={{ overflowY: 'auto', height: '90vh', flex: 2 }}>
        <h4 className="feed4" style={{ color: "white" }}>
          {selectedCategory} <span style={{ color: "#FC1503" }}>videos</span>
        </h4>
        <Videos videos={videos} />
      </div>
    </div>
  );
}

export default Feed;


import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchFromAPI } from "../utils/fetchFromAPI";
import { Videos } from ".";

const SearchFeed = () => {
  const [videos, setVideos] = useState(null);
  const [loading, setLoading] = useState(true);  // For showing loading state
  const { searchTerm } = useParams();

  useEffect(() => {
    setLoading(true); // Start loading when the search term changes

    // Fetch YouTube and S3 data in parallel
    Promise.all([
      fetchFromAPI(`youtube/${searchTerm}`),  // Fetch from YouTube API
      fetchFromAPI(`s3/${searchTerm}`),      // Fetch from AWS S3
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
  }, [searchTerm]);

  if (loading) {
    return <div>Loading...</div>;  // Display loading message while fetching data
  }

  return (
    <div style={{ padding: '8px', minHeight: '95vh' }}>
      <h4 style={{ fontWeight: '900', color: 'white', marginBottom: '24px', marginLeft: '100px' }}>
        Search Results for <span style={{ color: '#FC1503' }}>{searchTerm}</span> videos
      </h4>
      <div style={{ display: 'flex' }}>
        <div style={{ marginRight: '100px' }} />
        <Videos videos={videos} />
      </div>
    </div>
  );
};

export default SearchFeed;


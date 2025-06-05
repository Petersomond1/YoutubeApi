// YoutubeApiClient/src/components/SearchFeed.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchFromAPI } from "../utils/fetchFromAPI";
import { Videos } from ".";

const SearchFeed = () => {
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [s3Videos, setS3Videos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { searchTerm } = useParams();

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchTerm || searchTerm.trim() === "") {
        setYoutubeVideos([]);
        setS3Videos([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Updated to match your backend search endpoint structure
        const data = await fetchFromAPI(`search?searchTerm=${encodeURIComponent(searchTerm)}&maxResults=20`);
        
        if (data.success) {
          setYoutubeVideos(data.youtubeVideos || []);
          setS3Videos(data.dbVideos || []);
          console.log("searchfeed YouTube Videos:", data.youtubeVideos);
          console.log("searchfeed S3 Videos:", data.dbVideos);
          console.log("searchfeed Total Results:", data.totalResults);
        } else {
          throw new Error(data.error || "Search failed");
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setError(error.message || "Failed to search videos");
        setYoutubeVideos([]);
        setS3Videos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchTerm]);

  const totalResults = youtubeVideos.length + s3Videos.length;

  return (
    <div style={{ padding: "8px", minHeight: "95vh" }}>
      <h4
        style={{
          fontWeight: "900",
          color: "white",
          marginBottom: "24px",
          marginLeft: "100px",
        }}
      >
        Search Results for{" "}
        <span style={{ color: "#FC1503" }}>{searchTerm}</span> videos
      </h4>

      {/* Loading State */}
      {loading && (
        <div style={{ marginLeft: "100px", color: "white" }}>
          <p>Searching for "{searchTerm}"...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{ marginLeft: "100px", color: "red" }}>
          <p>{error}</p>
        </div>
      )}

      {/* Results Stats */}
      {!loading && !error && totalResults > 0 && (
        <div style={{ marginLeft: "100px", marginBottom: "20px" }}>
          <p style={{ color: "#aaa", fontSize: "14px" }}>
            Found {totalResults} results 
            {youtubeVideos.length > 0 && ` • YouTube: ${youtubeVideos.length}`}
            {s3Videos.length > 0 && ` • Database: ${s3Videos.length}`}
          </p>
        </div>
      )}

      {/* No Results */}
      {!loading && !error && totalResults === 0 && searchTerm && (
        <div style={{ marginLeft: "100px", color: "white" }}>
          <p>No results found for "{searchTerm}"</p>
          <p style={{ color: "#aaa", fontSize: "14px" }}>
            Try different keywords or check your spelling
          </p>
        </div>
      )}

      {/* Results Display */}
      {!loading && !error && totalResults > 0 && (
        <div style={{ display: "flex" }}>
          <div style={{ marginRight: "100px" }} />
          <div>
            {/* YouTube Videos Section */}
            {youtubeVideos.length > 0 && (
              <>
                <h5 style={{ color: "white", marginBottom: "15px" }}>
                  YouTube Videos ({youtubeVideos.length})
                </h5>
                <Videos videos={youtubeVideos} />
              </>
            )}
            
            {/* S3/Database Videos Section */}
            {s3Videos.length > 0 && (
              <>
                <h5 style={{ color: "white", marginTop: "30px", marginBottom: "15px" }}>
                  Database Videos ({s3Videos.length})
                </h5>
                <Videos videos={s3Videos} />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFeed;
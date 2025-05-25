//  youtubefront\src\components\SearchFeed.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchFromAPI } from "../utils/fetchFromAPI";
import { Videos } from ".";

const SearchFeed = () => {
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [s3Videos, setS3Videos] = useState([]);
  const { searchTerm } = useParams();

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const data = await fetchFromAPI(`search?searchTerm=${searchTerm}`);
        setYoutubeVideos(data.youtubeVideos);
        setS3Videos(data.dbVideos);
        console.log("searchfeed YouTube Videos:", data.youtubeVideos);
        console.log("searchfeed S3 Videos:", data.dbVideos);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchSearchResults();
  }, [searchTerm]);

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

      <div style={{ display: "flex" }}>
        <div style={{ marginRight: "100px" }} />
        <div>
          <h5 style={{ color: "white" }}>YouTube Videos</h5>
          <Videos videos={youtubeVideos} />
          <h5 style={{ color: "white" }}>S3 Videos</h5>
          <Videos videos={s3Videos} />
        </div>
      </div>
    </div>
  );
};

export default SearchFeed;

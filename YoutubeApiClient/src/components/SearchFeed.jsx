import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchFromAPI } from "../utils/fetchFromAPI";
import { Videos } from ".";


const SearchFeed = () => {
 const [videos, setVideos] = useState(null);
 const { searchTerm } = useParams();

 useEffect(() => {
    fetchFromAPI(`search?part=snippet&q=${searchTerm}`)
      .then((data) => setVideos(data.items));
 }, [searchTerm]);

 return (
    <div style={{ padding: '8px', minHeight: '95vh' }}>
      <h4 style={{ fontWeight: '900', color: 'white', marginBottom: '24px', marginLeft: '100px' }}>
        Search Results for <span style={{ color: '#FC1503' }}>{searchTerm}</span> videos
      </h4>
      <div style={{ display: 'flex' }}>
        <div style={{ marginRight: '100px' }}/>
        <Videos videos={videos} />
      </div>
    </div>
 );
};

export default SearchFeed;

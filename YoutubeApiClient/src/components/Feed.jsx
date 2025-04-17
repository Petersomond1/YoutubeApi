import React, { useEffect, useState } from "react";
import "../index.css";
import { fetchFromAPI } from "../utils/fetchFromAPI";
import Sidebar from './Sidebar';
import Videos from './Videos';

function Feed() {
  const [selectedCategory, setSelectedCategory] = useState("New");
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    // setVideos(null);
     fetchFromAPI(`search?part=snippet&q=${selectedCategory}`)
     .then((data) => setVideos(data.items));
  }, [selectedCategory]);

  return (
    <div className="feed1">
      <div className="feed2">
         <Sidebar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}  /> 
        <p className="copyright">
          Copyright © 2024 Youtube_Atlanta Media
        </p>
      </div>
       <div className="feed3" style= {{overflowY: 'auto', height: '90vh', flex: 2 }}>
        <h4 className="feed4" style={{ color: "white" }}>{selectedCategory} <span style={{ color: "#FC1503" }}>videos</span>
        </h4>
         <Videos videos={videos}/> 
      </div> 
    </div>
  );
}

export default Feed;

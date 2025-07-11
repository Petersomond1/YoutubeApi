// youtubefront\src\components\Sidebar.jsx
import React from "react";
import "../index.css";
import { categories } from "../utils/Constants";

function Sidebar({ selectedCategory, setSelectedCategory }) {
  return (
    <div className="sidebar">
      {categories.map((category) => (
        <button
          className="category-btn"
          onClick={() => setSelectedCategory(category.name)}
          style={{
            background: category.name === selectedCategory && "#FC1503",

            color: "white",
          }}
          key={category.name}
        >
          <span
            style={{
              color: category.name === selectedCategory ? "white" : "red",
              marginRight: "15px",
            }}
          >
            {category.icon}{" "}
          </span>

          <span
            style={{
              opacity: category.name === selectedCategory ? "1" : "0.8",
            }}
          >
            {category.name}
          </span>
        </button>
      ))}
    </div>
  );
}

export default Sidebar;
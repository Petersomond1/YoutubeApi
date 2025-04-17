// import React from 'react'

// function Navbar() {
//   return (
//     <div>Navbar</div>
//   )
// }

// export default Navbar

import React from 'react';
import  '../index.css';
import {Link} from 'react-router-dom';
import { logo } from '../utils/Constants';
import SearchBar from './SearchBar';


function Navbar() {
  return (
    <div className='navbar' styles={{position:  "sticky", background: '#000', top: 0, }}>
      <Link to='/' style={{ display: "flex", alignItems: "center" }}>
      <img src={logo} alt="logo" height={45} />
      <span>
        <h1 style={{ color: "#fff", marginLeft: "10px" }}>Youtube_Petersomond, USA GA</h1>
      </span>
      </Link>
      <SearchBar />
      </div>
  )
}

export default Navbar
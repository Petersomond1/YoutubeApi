import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import '../index.css';

function SearchBar() {

    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
   
    const onhandleSubmit = (e) => {
       e.preventDefault();
   
       if (searchTerm) {
         navigate(`/search/${searchTerm}`);
         setSearchTerm('');
       }
    };

    return (
        <form className='searchbar1' onSubmit={onhandleSubmit}>

        <input
        className='searchbar2'
        placeholder='Search...'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button type="submit" style={{ padding: '10px', color: 'red' }} aria-label='search'>
                <CiSearch />
        </button>
        </form> 
    )
}

export default SearchBar
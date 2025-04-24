import React from 'react';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar, Feed, VideoDetail, ChannelDetail, SearchFeed, Uploader } from './components/index';

function App () {
  return (
    <BrowserRouter>
      <div className='app'>
        <Navbar />
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/Video/:id" element={<VideoDetail />} />
          <Route path="/Channel/:id" element={<ChannelDetail />} />
          <Route path="/search/:searchTerm" element={<SearchFeed />} />
          <Route path="/upload" element={<Uploader />} />  {/* Add this route */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

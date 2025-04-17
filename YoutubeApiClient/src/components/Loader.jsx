import React from 'react';
import '../index.css';

const Loader = () => (
 <div style={{ minHeight: '95vh' }}>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <div className="circular-progress"></div>
    </div>
 </div>
);

export default Loader;

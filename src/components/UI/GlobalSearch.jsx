import React, { useState } from 'react';


export default function GlobalSearch({ onSearchChange }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (event) => {
    const newTerm = event.target.value;
    setSearchTerm(newTerm);
   
    onSearchChange(newTerm);
  };

  return (
    <div className="global-search-container">
      <input
        type="text"
        placeholder="Search tracks, artists, or albums..."
        value={searchTerm}
        onChange={handleChange}
        aria-label="Global search across all fields"
        className="global-search-input"
      />
      
    </div>
  );
}
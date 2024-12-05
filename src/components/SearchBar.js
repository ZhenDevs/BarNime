import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    
    if (trimmedQuery) {
      console.log('Submitting search:', trimmedQuery);
      navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center w-full max-w-md">
      <input
        type="text"
        placeholder="Search anime..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-l-full focus:outline-none 
                 focus:ring-2 focus:ring-blue-500 focus:bg-gray-700 transition-colors"
        required
      />
      <button 
        type="submit"
        className="px-6 py-2 bg-blue-500 text-white rounded-r-full hover:bg-blue-600 
                 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <FaSearch />
      </button>
    </form>
  );
};

export default SearchBar;
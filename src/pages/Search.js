import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('Searching for:', query);

        const response = await fetch(`http://localhost:3001/api/search?q=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }

        const data = await response.json();
        console.log('Search results:', data);
        setResults(Array.isArray(data) ? data : []);

      } catch (err) {
        console.error('Error searching:', err);
        setError(err.message || 'Failed to search anime');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-400 bg-red-900/50 p-6 rounded-lg backdrop-blur-sm">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6 text-white">
          {query ? `Search Results for: ${query}` : 'Search Results'}
        </h1>
        
        {results.length === 0 ? (
          <div className="text-center bg-gray-800/50 p-8 rounded-xl backdrop-blur-sm">
            <p className="text-gray-300 text-lg">
              {query 
                ? `No results found for "${query}"`
                : "Please enter a search term"
              }
            </p>
            <p className="text-gray-400 mt-2">
              {query && "Try searching with different keywords"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {results.map((anime, index) => (
              <Link 
                to={`/anime/${anime.slug}`} 
                key={anime.slug || index}
                className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg 
                         transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="relative pb-[140%]">
                  <img
                    src={anime.thumbnail}
                    alt={anime.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = '/placeholder.jpg';
                      e.target.onerror = null;
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-white line-clamp-2 mb-2">
                    {anime.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {anime.type && (
                      <span className="inline-block bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded">
                        {anime.type}
                      </span>
                    )}
                    {anime.status && (
                      <span className="inline-block bg-purple-900/50 text-purple-300 text-xs px-2 py-1 rounded">
                        {anime.status}
                      </span>
                    )}
                    {anime.rating && (
                      <span className="inline-block bg-green-900/50 text-green-300 text-xs px-2 py-1 rounded">
                        ★ {anime.rating}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg 
                     transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Search;
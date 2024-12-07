import React, { useState, useEffect } from 'react';
import { getTopAiring, getRecentAnime } from '../services/api';
import AnimeCard from '../components/AnimeCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Home = () => {
  const { isDarkMode } = useTheme();
  const [topAiring, setTopAiring] = useState([]);
  const [recentAnime, setRecentAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [topAiringData, recentAnimeData] = await Promise.all([
          getTopAiring(),
          getRecentAnime()
        ]);

        setTopAiring(Array.isArray(topAiringData) ? topAiringData : []);
        setRecentAnime(Array.isArray(recentAnimeData) ? recentAnimeData : []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to fetch anime data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="container mx-auto px-4 py-8">
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Top Airing Anime
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(10)].map((_, index) => (
                <div key={index} className="bg-gray-800/50 rounded-lg p-4 animate-pulse">
                  <div className="aspect-w-3 aspect-h-4 bg-gray-700 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center p-4`}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-900/20 backdrop-blur-sm border border-red-500/20 rounded-lg p-8 max-w-md w-full text-center"
        >
          <div className="text-red-400 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}
    >
      <div className="container mx-auto px-4 py-8">
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Top Airing Anime
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {topAiring.length > 0 ? (
              topAiring.map((anime, index) => (
                <motion.div
                  key={anime.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AnimeCard
                    anime={anime}
                    className={`${
                      isDarkMode 
                        ? 'bg-gray-800/50' 
                        : 'bg-white'
                    } backdrop-blur-sm rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/10`}
                  />
                </motion.div>
              ))
            ) : (
              <p className={`col-span-full text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No top airing anime available at the moment.
              </p>
            )}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Recent Updates
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {recentAnime.length > 0 ? (
              recentAnime.map((anime, index) => (
                <motion.div
                  key={anime.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AnimeCard
                    anime={anime}
                    className={`${
                      isDarkMode 
                        ? 'bg-gray-800/50' 
                        : 'bg-white'
                    } backdrop-blur-sm rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/10`}
                  />
                </motion.div>
              ))
            ) : (
              <p className={`col-span-full text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No recent updates available at the moment.
              </p>
            )}
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default Home;
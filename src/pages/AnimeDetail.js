import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaPlay, FaStar, FaTv, FaInfoCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const AnimeDetail = () => {
  const { slug } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('episodes');
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/anime/${slug}`);
        if (!response.ok) {
          throw new Error('Failed to fetch anime details');
        }
        const data = await response.json();
        setAnime(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeDetails();
  }, [slug]);

  if (loading) return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex justify-center items-center`}>
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex justify-center items-center`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-red-500 text-xl bg-red-900/20 p-6 rounded-lg backdrop-blur-sm"
      >
        <FaInfoCircle className="inline-block mr-2" />
        Error: {error}
      </motion.div>
    </div>
  );
  
  if (!anime) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}
    >
      <div className="relative h-[500px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
          style={{
            backgroundImage: `url(${anime.thumbnail})`,
            filter: 'blur(8px)',
            transform: 'scale(1.1)'
          }}
        />
        <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent' : 'bg-gradient-to-t from-gray-50 via-gray-50/80 to-transparent'}`}>
          <div className="container mx-auto px-4 h-full flex items-end pb-12">
            <motion.div 
              variants={itemVariants}
              className="flex flex-col md:flex-row gap-8 items-end"
            >
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-64 flex-shrink-0"
              >
                <img 
                  src={anime.thumbnail} 
                  alt={anime.title}
                  className="w-full rounded-lg shadow-2xl border-4 border-gray-800 transform hover:shadow-blue-500/25"
                />
              </motion.div>

              <div className="flex-grow">
                <motion.h1 
                  variants={itemVariants}
                  className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"
                >
                  {anime.title}
                </motion.h1>
                <motion.div 
                  variants={itemVariants}
                  className="flex flex-wrap gap-4 text-sm"
                >
                  {anime.score && (
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className="flex items-center gap-2 bg-yellow-500/20 px-4 py-2 rounded-full backdrop-blur-sm"
                    >
                      <FaStar className="text-yellow-500" />
                      <span className="font-semibold">{anime.score}</span>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8">
          <TabButton 
            active={activeTab === 'episodes'} 
            onClick={() => setActiveTab('episodes')}
            icon={<FaTv />}
            text="Episodes"
          />
          <TabButton 
            active={activeTab === 'details'} 
            onClick={() => setActiveTab('details')}
            icon={<FaInfoCircle />}
            text="Details"
          />
        </div>

        {activeTab === 'episodes' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          >
            {anime.episodes?.map((episode, index) => (
              <motion.div
                key={episode.slug}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={`/watch/${episode.slug}`}
                  className={`block ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-lg overflow-hidden hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} transition-colors`}
                >
                  <div className="p-4 backdrop-blur-sm bg-gradient-to-b from-transparent to-black/50">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">
                        Episode {anime.episodes.length - index}
                      </span>
                      <FaPlay className="text-blue-400" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'details' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div className={`bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 shadow-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                Synopsis
              </h2>
              <p className="leading-relaxed">{anime.synopsis}</p>
            </div>

            <div className={`bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 shadow-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                Information
              </h2>
              <div className="space-y-4">
                {Object.entries(anime)
                  .filter(([key]) => !['episodes', 'synopsis', 'thumbnail', 'title'].includes(key))
                  .map(([key, value]) => (
                    <motion.div
                      key={key}
                      whileHover={{ x: 10 }}
                      className={`flex items-center gap-4 p-3 rounded-lg hover:${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-300/50'} transition-colors`}
                    >
                      <span className="capitalize">{key.replace(/_/g, ' ')}:</span>
                      <span>{value}</span>
                    </motion.div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const TabButton = ({ active, onClick, icon, text }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all
      ${active 
        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'}`}
  >
    {icon}
    {text}
  </motion.button>
);

export default AnimeDetail;
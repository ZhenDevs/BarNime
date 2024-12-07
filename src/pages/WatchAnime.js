import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaDownload, FaBackward, FaForward } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const WatchAnime = () => {
  const { episodeSlug } = useParams();
  const navigate = useNavigate();
  const [streamData, setStreamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [episodeList, setEpisodeList] = useState([]);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchStreamData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/episode/${episodeSlug}`);
        if (!response.ok) throw new Error('Failed to fetch stream data');
        const data = await response.json();
        console.log('Stream Data:', data);

        if (!data.streamUrl) throw new Error('No streaming URL available');
        setStreamData(data);

        if (data.animeId) {
          const animeResponse = await fetch(`http://localhost:3001/api/anime/${data.animeId}`);
          if (!animeResponse.ok) throw new Error('Failed to fetch anime data');
          const animeData = await animeResponse.json();

          if (!animeData.episodes || animeData.episodes.length === 0) {
            throw new Error('No episodes available');
          }

          const sortedEpisodes = [...animeData.episodes].sort((a, b) => a.number - b.number);
          setEpisodeList(sortedEpisodes);

          console.log('Sorted Episodes:', sortedEpisodes);
        }
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStreamData();
  }, [episodeSlug]);

  const currentEpisodeIndex = episodeList.findIndex(episode => episode.slug === episodeSlug);
  console.log('Episode List:', episodeList);
  console.log('Current Episode Index:', currentEpisodeIndex);
  console.log('Current Episode:', episodeList[currentEpisodeIndex]);

  const canGoNext = currentEpisodeIndex < episodeList.length - 1;
  const canGoPrevious = currentEpisodeIndex > 0;

  const goToNextEpisode = () => {
    if (canGoNext && episodeList[currentEpisodeIndex + 1]) {
      navigate(`/watch/${episodeList[currentEpisodeIndex + 1].slug}`);
    }
  };

  const goToPreviousEpisode = () => {
    if (canGoPrevious && episodeList[currentEpisodeIndex - 1]) {
      navigate(`/watch/${episodeList[currentEpisodeIndex - 1].slug}`);
    }
  };

  if (loading) return (
    <div className={`flex justify-center items-center min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
    </div>
  );

  if (error) return (
    <div className={`flex justify-center items-center min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="bg-red-900/50 p-6 rounded-lg backdrop-blur-sm">
        <p className="text-red-300 text-lg font-medium">Error: {error}</p>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className={`mb-8 ${isDarkMode ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gradient-to-r from-blue-200 to-purple-200'} p-6 rounded-xl shadow-lg max-w-[1280px] mx-auto`}>
          <h1 className="text-2xl md:text-3xl font-bold">{streamData?.title}</h1>
          {currentEpisodeIndex !== -1 && (
            <p className="text-lg mt-2 opacity-80">
              Episode {currentEpisodeIndex + 1} of {episodeList.length}
            </p>
          )}
        </div>

        <div className="relative group max-w-[1280px] mx-auto">
          <div className={`relative rounded-xl overflow-hidden ${isDarkMode ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500' : 'bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200'} p-0.5`}>
            <div className="bg-black rounded-xl overflow-hidden">
              <div className="w-full" style={{ height: "calc(100vh - 300px)", minHeight: "480px" }}>
                <iframe
                  src={streamData?.streamUrl}
                  title={streamData?.title}
                  allowFullScreen
                  className="w-full h-full"
                  style={{ height: "100%" }}
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        <div className={`mt-8 backdrop-blur-md ${isDarkMode ? 'bg-white/10' : 'bg-gray-100/10'} rounded-xl p-6 max-w-[1280px] mx-auto`}>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaDownload className="mr-2" />
            Download Options
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {streamData?.downloadLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-between ${isDarkMode ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-gray-200/50 hover:bg-gray-300/50'} p-4 rounded-lg transition-all duration-300 backdrop-blur-sm group`}
              >
                <span className="font-medium">{link.quality}</span>
                <span className={`bg-blue-500 px-3 py-1 rounded-full text-sm font-medium group-hover:bg-blue-400 transition-colors`}>
                  Download
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-between max-w-[1280px] mx-auto">
          <button
            onClick={goToPreviousEpisode}
            className={`px-6 py-3 rounded-lg transition-colors backdrop-blur-sm flex items-center ${
              canGoPrevious
                ? `${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'}`
                : 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!canGoPrevious}
          >
            <FaBackward className="mr-2" />
            Previous Episode
          </button>
          <button
            onClick={goToNextEpisode}
            className={`px-6 py-3 rounded-lg transition-colors flex items-center ${
              canGoNext
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!canGoNext}
          >
            Next Episode
            <FaForward className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WatchAnime;
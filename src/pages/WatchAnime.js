import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaDownload, FaBackward, FaForward } from 'react-icons/fa';

const WatchAnime = () => {
  const { episodeSlug } = useParams();
  const [streamData, setStreamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStreamData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/episode/${episodeSlug}`);
        if (!response.ok) throw new Error('Failed to fetch stream data');
        const data = await response.json();
        if (!data.streamUrl) throw new Error('No streaming URL available');
        setStreamData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStreamData();
  }, [episodeSlug]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="bg-red-900/50 p-6 rounded-lg backdrop-blur-sm">
        <p className="text-red-300 text-lg font-medium">Error: {error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Title Section with Gradient */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl shadow-lg max-w-[1280px] mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold">{streamData?.title}</h1>
        </div>

        {/* Video Player Section */}
        <div className="relative group max-w-[1280px] mx-auto">
          {/* Video Container with Gradient Border */}
          <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-0.5">
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

        {/* Download Section with Glass Effect */}
        <div className="mt-8 backdrop-blur-md bg-white/10 rounded-xl p-6 max-w-[1280px] mx-auto">
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
                className="flex items-center justify-between bg-gray-800/50 hover:bg-gray-700/50 
                         p-4 rounded-lg transition-all duration-300 backdrop-blur-sm group"
              >
                <span className="font-medium">{link.quality}</span>
                <span className="bg-blue-500 px-3 py-1 rounded-full text-sm font-medium 
                               group-hover:bg-blue-400 transition-colors">
                  Download
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Navigation Buttons with Glass Effect */}
        <div className="mt-8 flex justify-between max-w-[1280px] mx-auto">
          <button className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg transition-colors 
                           backdrop-blur-sm flex items-center">
            <FaBackward className="mr-2" />
            Previous Episode
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg transition-colors 
                           flex items-center">
            Next Episode
            <FaForward className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WatchAnime;
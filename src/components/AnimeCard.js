import React from 'react';
import { Link } from 'react-router-dom';

const AnimeCard = ({ anime }) => {
  if (!anime) return null;

  return (
    <Link 
      to={`/anime/${anime.slug}`} 
      className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="relative aspect-[3/4]">
        <img 
          src={anime.thumbnail} 
          alt={anime.title} 
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm text-gray-800 dark:text-gray-100 line-clamp-2 min-h-[2.5rem]">
          {anime.title}
        </h3>
        <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
          {anime.episode && (
            <span className="flex items-center">
              <span>EP {anime.episode}</span>
            </span>
          )}
          {anime.type && (
            <>
              <span className="mx-2">•</span>
              <span>{anime.type}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default AnimeCard;
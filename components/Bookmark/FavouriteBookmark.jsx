import React from 'react';
import { GrFormPreviousLink } from "react-icons/gr";
import { fetchFavorites } from '../../redux/lib/favoritesSlice';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

// const FavouriteBookmark = ({ favorites, onBackClick }) => {
  const FavouriteBookmark = ({ onBackClick }) => {
    const { b_id } = useParams();
    const favorites = useSelector((state)=>state.favoritesSlice.favorites); // Accessing the shared data

const uniqueQueries = new Set();

  // Filter the favorites to include only unique queries
  const uniqueFavorites = favorites.filter(favorite => {
    const isUnique = !uniqueQueries.has(favorite.rank.query);
    uniqueQueries.add(favorite.rank.query);
    return isUnique;
  });
  return (
    <div>
      <div className="flex justify-start mb-4 bg-white w-7 h-8">
        <button 
          onClick={onBackClick}
        >
          <GrFormPreviousLink size={20} className=' text-white'/>
        </button>
      </div>

      <h3 className="text-xl font-semibold mb-3 text-gray-800">Favorites Bookmarks:</h3>
      <ul className="list-none list-inside">
        {uniqueFavorites.map(favorite => (
          <li key={favorite.favo_id} className='flex justify-between items-center mb-3'>
            <a href={favorite.rank.source_url}
               target="_blank"
               rel="noopener noreferrer"
               className="text-gray-600">{favorite.rank.query}</a>
            <a href={favorite.rank.source_url}    target="_blank"
               rel="noopener noreferrer">{favorite.rank.rank}</a>
          </li>  
        ))}
      </ul>
    </div>
  );
};

export default FavouriteBookmark;

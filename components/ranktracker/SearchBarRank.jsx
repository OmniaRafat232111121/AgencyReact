import {FiSearch} from 'react-icons/fi'
const SearchBarRank = ({ searchQuery, handleSearchInputChange }) => (
    <div className="p-4 w-full px-2">
      <label className="block text-lg mt-3 mb-1">Search for keyword</label>
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700" size={20} />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchInputChange}
          className="pl-10 pr-4 h-[39px] border font-semibold rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>
    </div>
  );
export default SearchBarRank;
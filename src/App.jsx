<div className='flex  '>

<div className='flex flex-col'>
<div className='flex space-x-4'>
<select
  value={selectedOption}
  onChange={handleChange}
  className="block w-[550px] mt-1 bg-white border p-2
   border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500
    focus:ring-opacity-50"
>
  <option value="">Select Action</option>
  {options.map((option) => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ))}
</select>
<button
  onClick={() => handleBulkAction(selectedBulkAction)}
  disabled={!selectedBulkAction}
  className="p-2  w-[30%] text-white bg-blue rounded hover:bg-blue focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
>
  Go
</button>
</div>

{isAddingBookmark && (
  <div className="relative z-50 mt-1">
    <select
      onChange={handleBookmarkSelection}
      className="block w-[50px] mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"

      defaultValue=""
    >
        <option value="">Select Bookmark</option>

      {displayBookmarkSlice.map((bookmark) => (
        <option className='' key={bookmark.id} value={bookmark.id}>
          {bookmark.name}
        </option>
      ))}
    </select>
  </div>
)}
</div>



</div>

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBookmark } from '../redux/lib/createGroup';

const Createbookmark = () => {
  const dispatch = useDispatch();
  const [newBookmark, setNewBookmark] = useState('');

  const bookmarks = useSelector((state) => state.displayBookmarkSlice.bookmarks);
console.log(bookmarks)
  const handleSubmit = (e) => {
    e.preventDefault();

    const bookmarkData = {
      name: newBookmark,
    };

    dispatch(createBookmark(bookmarkData));
    console.log(bookmarkData)
    setNewBookmark('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter bookmark data"
        value={newBookmark}
        onChange={(e) => setNewBookmark(e.target.value)}
      />
      
    </form>
  );
};

export default Createbookmark;

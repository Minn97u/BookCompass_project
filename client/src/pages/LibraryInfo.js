import React from 'react';

const LibraryIframe = () => {
  return (
    <div>
      <iframe
        src='/library_books_tables_ko.html'
        style={{ width: '100%', height: '1100px', border: 'none' }}
        title='Library Books Table'
      />
      <iframe
        src='/book_rank_tables_ko.html'
        style={{
          width: '100%',
          height: '700px',
          border: 'none',
          marginTop: '20px'
        }}
        title='Book Rank Tables'
      />
    </div>
  );
};

export default LibraryIframe;

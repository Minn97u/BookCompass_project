import styled from 'styled-components';

const LibraryInfo = () => {
  return (
    <Container>
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
    </Container>
  );
};

const Container = styled.div`
  padding: 40px 60px;
  background-color: #f9f5f1;
`;

export default LibraryInfo;

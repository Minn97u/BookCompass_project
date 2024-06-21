import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getPosts } from '../api/BoardApi'; // API 호출 추가
import InfiniteScroll from 'react-infinite-scroll-component';

const Gallery = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await getPosts(page, 10, '추천 장소'); // "추천 장소" 태그의 글들만 가져옴
      setPosts((prevPosts) => [...prevPosts, ...res.posts]);
      if (res.posts.length === 0) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchMoreData = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <ScrollableDiv id='scrollableDiv'>
      {' '}
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<Loading>Loading...</Loading>}
        endMessage={<EndMessage>모든 게시물을 불러왔습니다.</EndMessage>}
        scrollableTarget='scrollableDiv'
      >
        <BoardContent>
          {posts.map((item) => (
            <BoardItem key={item.shortId}>
              <ImageContainer>
                <Image
                  src={
                    item.postImg
                      ? `${item.postImg.split('public')[1]}`
                      : './No_image_available.png'
                  }
                  alt={item.title}
                />
                <TitleOverlay>{item.title}</TitleOverlay>
              </ImageContainer>
            </BoardItem>
          ))}
        </BoardContent>
      </InfiniteScroll>
    </ScrollableDiv>
  );
};

const ScrollableDiv = styled.div`
  height: 100vh; /* 높이를 설정하여 스크롤 가능하게 함 */
  overflow: auto;
`;

const BoardContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 3fr));
  gap: 1.25rem;
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const BoardItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0.625rem;
  border-radius: 0.625rem;
  background: white;
  color: #543d20;
  cursor: pointer;
  box-sizing: border-box;
  &.placeholder {
    border: 0.063rem dashed #ddd;
  }
`;

const TitleOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  text-align: center;
  padding: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
`;

const ImageContainer = styled.div`
  width: 100%;
  padding-top: 75%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 0.625rem;
  &:hover ${TitleOverlay} {
    opacity: 1;
  }
`;

const Image = styled.img`
  top: 0;
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
`;

const Loading = styled.div`
  text-align: center;
  padding: 1rem;
  font-size: 1.25rem;
`;

const EndMessage = styled.div`
  text-align: center;
  padding: 1rem;
  font-size: 1.25rem;
  color: #888;
`;

export default Gallery;

import React from 'react';
import styled from 'styled-components';

const PostList = ({ posts, openModal }) => (
  <BoardContent>
    {console.log('게시글 목록', posts)}
    {posts.map((item) => (
      <BoardItem key={item.shortId} onClick={() => openModal(item)}>
        <ImageContainer>
          <Image
            src={
              item.postImg
                ? `${item.postImg.split('/public')[1]}`
                : './No_image_available.png'
            }
            alt={item.title}
          />
        </ImageContainer>
        <Text>{item.title}</Text>
      </BoardItem>
    ))}
  </BoardContent>
);

const BoardContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.25rem;
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 1200px) {
    grid-template-columns: repeat(5, 1fr);
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

const ImageContainer = styled.div`
  width: 100%;
  padding-top: 75%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 0.625rem;
  margin-bottom: 0.625rem;
`;

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  cursor: pointer;
`;

const Text = styled.p`
  white-space: pre-wrap;
  word-wrap: break-word;
`;

export default PostList;

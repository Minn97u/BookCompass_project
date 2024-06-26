import React from 'react';
import styled from 'styled-components';
import CommentSection from './CommentSection';

const DetailPageContent = ({
  selectedItem,
  userName,
  handleEditClick,
  handleDeleteClick,
  handleCommentSubmit,
  handleCommentDelete,
  handleCommentUpdate
}) => {
  return (
    <Container>
      <Header>
        <Title>{selectedItem.title}</Title>
        {userName === selectedItem.author.name && (
          <ActionButtons>
            <TextButton onClick={handleEditClick}>수정</TextButton>
            <Divider>|</Divider>
            <TextButton onClick={handleDeleteClick}>삭제</TextButton>
          </ActionButtons>
        )}
        <Author>
          <UserAvatar>
            <ProfileImage src={selectedItem.author.profilePic} alt='Profile' />
          </UserAvatar>
          {selectedItem.author.name}
        </Author>
      </Header>
      <Hr />
      <DateText>{new Date(selectedItem.createdAt).toLocaleString()}</DateText>
      <ContentBody>
        <div>
          {selectedItem.postImg && (
            <PostImage
              src={`${selectedItem.postImg.split('/public')[1]}`}
              alt={selectedItem.title}
            />
          )}
          <Text>{selectedItem.content}</Text>
        </div>
      </ContentBody>
      <CommentBox>
        <CommentSection
          selectedItem={selectedItem}
          userName={userName}
          handleCommentSubmit={handleCommentSubmit}
          handleCommentDelete={handleCommentDelete}
          handleCommentUpdate={handleCommentUpdate}
        />
      </CommentBox>
    </Container>
  );
};

export default DetailPageContent;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  padding: 1.25rem;
  width: 100%;
  max-width: 70rem;
  height: auto;
  max-height: 80vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.p`
  font-size: 1.6rem;
  font-weight: 500;
  margin: 0;
`;

const DateText = styled.div`
  font-size: 0.875rem;
  color: #888;
  text-align: right;
`;

const Author = styled.div`
  font-size: 1rem;
  color: #191619;
  margin-left: auto;
  font-weight: 600;
  display: flex;
  align-items: center;
`;

const ContentBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 50px 0px 30px 0px;
`;

const TextButton = styled.span`
  color: gray;
  cursor: pointer;
  font-size: 0.875rem;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.625rem;
  height: 1.5rem;
  margin-top: 0.5rem;
  margin-left: 1.25rem;
`;

const PostImage = styled.img`
  width: 100%;
  max-width: 20rem;
  height: auto;
  object-fit: contain;
  cursor: pointer;
`;

const Text = styled.p`
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const ProfileImage = styled.img`
  width: 1.7rem;
  border-radius: 50%;
`;

const UserAvatar = styled.div`
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  margin-right: 0.3rem;

  svg {
    width: 80%;
    height: 80%;
  }
`;

const Hr = styled.hr`
  border: none;
  border-top: 1px solid #ededed;
  width: 100%;
  margin-bottom: 10px;
`;

const CommentBox = styled.div`
  text-align: left;
`;

const Divider = styled.span`
  color: #d7d7d7;
  margin: 0px -5px;
`;

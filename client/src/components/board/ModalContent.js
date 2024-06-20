import React, { useState } from 'react';
import styled from 'styled-components';
import CommentSection from './CommentSection';

const ModalContent = ({
  selectedItem,
  userName,
  handleEditClick,
  handleDeleteClick,
  handleCommentSubmit,
  handleCommentDelete,
  handleCommentUpdate
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <StyledModalContent>
      <ModalHeader>
        <ModalTitle>{selectedItem.title}</ModalTitle>
        {userName === selectedItem.author.name && (
          <ActionButtons>
            <TextButton onClick={handleEditClick}>수정</TextButton>
            <Divider>|</Divider>
            <TextButton onClick={handleDeleteClick}>삭제</TextButton>
          </ActionButtons>
        )}
        <ModalAuthor
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <CommentAvatar>
            <ProfileImage src={selectedItem.author.profilePic} alt='Profile' />
          </CommentAvatar>
          {console.log(selectedItem)}
          {selectedItem.author.name}
          {showTooltip && (
            <Tooltip>
              <p>선호 작가: {selectedItem.author.favoriteAuthor}</p>
              <p>자기 소개: {selectedItem.author.profileMsg}</p>
            </Tooltip>
          )}
        </ModalAuthor>
      </ModalHeader>
      <Hr />
      <DateText>{new Date(selectedItem.createdAt).toLocaleString()}</DateText>
      <ModalBody>
        <ContentBox>
          <PostImage
            src={
              selectedItem.postImg
                ? `${selectedItem.postImg.split('/public')[1]}`
                : './No_image_available.png'
            }
            alt={selectedItem.title}
          />
          <Text>{selectedItem.content}</Text>
        </ContentBox>
        <CommentSection
          selectedItem={selectedItem}
          userName={userName}
          handleCommentSubmit={handleCommentSubmit}
          handleCommentDelete={handleCommentDelete}
          handleCommentUpdate={handleCommentUpdate}
        />
      </ModalBody>
    </StyledModalContent>
  );
};

const StyledModalContent = styled.div`
  background: white;
  padding: 2.5rem 1.25rem 2rem 1.25rem;
  width: 92%;
  max-width: 60rem;
  height: auto;
  max-height: 80vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  position: relative;
  background-color: transparent;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3px;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  margin: 0;
`;

const ModalAuthor = styled.div`
  font-size: 1rem;
  color: #191619;
  font-weight: 600;
  margin-left: auto;
  display: flex;
  align-items: center;
  position: relative;
`;

const ModalBody = styled.div`
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
  margin-top: 10px;
`;

const TextButton = styled.span`
  color: gray;
  cursor: pointer;
  font-size: 0.875rem;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.625rem;
  height: 1.5rem;
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
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;

const CommentAvatar = styled.div`
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  margin-right: 0.5rem;

  svg {
    width: 80%;
    height: 80%;
  }
`;

const ContentBox = styled.div`
  margin-right: 30px;
  margin-top: 15px;
  width: 20rem;
`;

const Divider = styled.span`
  color: #d7d7d7;
  margin: 0px -5px;
`;

const Hr = styled.hr`
  border: none;
  border-top: 1px solid #ededed;
  width: 100%;
  margin-bottom: 10px;
`;

const DateText = styled.div`
  font-size: 0.875rem;
  color: #888;
  text-align: right;
`;

const Tooltip = styled.div`
  position: absolute;
  top: 100%;
  transform: translateX(-70%);
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 0.5rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
  white-space: nowrap;
`;

export default ModalContent;

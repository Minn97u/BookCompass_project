import React from 'react';
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
  return (
    <StyledModalContent>
      <ModalHeader>
        <ModalTitle>{selectedItem.title}</ModalTitle>
        <ModalDate>
          {new Date(selectedItem.createdAt).toLocaleString()}
        </ModalDate>
        {console.log(selectedItem.author.profilePic)}
        {userName === selectedItem.author.name && (
          <ActionButtons>
            <TextButton onClick={handleEditClick}>수정</TextButton>
            <TextButton onClick={handleDeleteClick}>삭제</TextButton>
          </ActionButtons>
        )}
        <ModalAuthor>
          <CommentAvatar>
            <ProfileImage src={selectedItem.author.profilePic} alt='Profile' />
          </CommentAvatar>
          {selectedItem.author.name}
        </ModalAuthor>
      </ModalHeader>

      <ModalBody>
        <div>
          <PostImage
            src={
              selectedItem.postImg
                ? `uploads/${selectedItem.postImg.split('/public')[1]}`
                : './No_image_available.png'
            }
            alt={selectedItem.title}
          />
          <Text>{selectedItem.content}</Text>
        </div>
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
  padding: 1.25rem;
  width: 94%;
  max-width: 60rem;
  height: auto;
  max-height: 80vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  margin: 0;
`;

const ModalDate = styled.div`
  font-size: 0.875rem;
  color: #888;
  margin-left: 0.65rem;
`;

const ModalAuthor = styled.div`
  font-size: 0.875rem;
  color: #191619;
  margin-left: auto;
  font-weight: bold;
  display: flex;
`;

const ModalBody = styled.div`
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
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
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;

const CommentAvatar = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  margin-right: 0.625rem;

  svg {
    width: 80%;
    height: 80%;
  }
`;

export default ModalContent;

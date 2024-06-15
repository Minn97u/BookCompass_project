import React, { useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { ReactComponent as UserIcon } from '../../assets/icons/usericon.svg';
import Pagination from './Pagination'; // Pagination 컴포넌트 임포트

const CommentSection = ({
  selectedItem,
  userName,
  handleCommentSubmit,
  handleCommentDelete,
  handleCommentUpdate
}) => {
  const { register, handleSubmit, setValue } = useForm();
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 3;

  const handleEditClick = (comment) => {
    setEditingCommentId(comment._id);
    setValue('editCommentText', comment.content);
  };

  const handleEditSubmit = (data) => {
    handleCommentUpdate(editingCommentId, data.editCommentText);
    setEditingCommentId(null);
  };

  const onSubmit = (data) => {
    handleCommentSubmit(data);
    setValue('commentText', '');
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = selectedItem.comments.slice(
    indexOfFirstComment,
    indexOfLastComment
  );

  return (
    <CommentSectionContainer>
      <FlexContainer>
        <h3>댓글</h3>
      </FlexContainer>
      <CommentInput
        placeholder='내용을 입력해 주세요.'
        {...register('commentText')}
      />
      <CommentButton onClick={handleSubmit(onSubmit)}>등록</CommentButton>
      <CommentList>
        {currentComments.map((comment) => (
          <CommentItem key={comment._id}>
            <CommentAvatar>
              {comment.author.profilePic ? (
                <ProfileImage src={comment.author.profilePic} alt='Profile' />
              ) : (
                <UserIcon />
              )}
            </CommentAvatar>
            <CommentContent>
              <strong>{comment.author.name}</strong>
              {editingCommentId === comment._id ? (
                <form onSubmit={handleSubmit(handleEditSubmit)}>
                  <CommentInput
                    placeholder='수정할 내용을 입력해 주세요.'
                    {...register('editCommentText')}
                  />
                  <CommentButton type='submit'>수정 완료</CommentButton>
                </form>
              ) : (
                <p>{comment.content}</p>
              )}
              {userName === comment.author.name &&
                editingCommentId !== comment._id && (
                  <ActionButtons>
                    <TextButton onClick={() => handleEditClick(comment)}>
                      수정
                    </TextButton>
                    <TextButton
                      onClick={() => handleCommentDelete(comment._id)}
                    >
                      삭제
                    </TextButton>
                  </ActionButtons>
                )}
            </CommentContent>
          </CommentItem>
        ))}
      </CommentList>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(selectedItem.comments.length / commentsPerPage)}
        onPageChange={handlePageChange}
      />
    </CommentSectionContainer>
  );
};

const CommentSectionContainer = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
`;

const CommentInput = styled.input.attrs({ type: 'text' })`
  width: 100%;
  padding: 0.625rem;
  margin-bottom: 0.625rem;
  border-radius: 0.325rem;
  border: 0.5px solid #ddd;
  box-sizing: border-box;
  height: 5rem;
`;

const CommentButton = styled.button`
  margin-left: auto;
  display: block;
  background-color: #543d20;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 1.25rem;
  cursor: pointer;
  font-size: 0.875rem;
`;

const CommentList = styled.div`
  margin-top: 1.25rem;
`;

const CommentItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.625rem;
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

const CommentContent = styled.div`
  flex: 1;
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;

export default CommentSection;

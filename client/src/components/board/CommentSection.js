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
    if (userName === null) {
      alert('로그인을 해주세요');
      return;
    }
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
        <CommentTitle>댓글</CommentTitle>
      </FlexContainer>
      <CommentInput
        placeholder='내용을 입력해 주세요.'
        {...register('commentText')}
      />
      <CommentButton onClick={handleSubmit(onSubmit)}>등록</CommentButton>
      <CommentList>
        {currentComments.map((comment, index) => (
          <CommentItem key={comment._id}>
            <CommentAvatar>
              <CommentUser>
                {comment.author.profilePic ? (
                  <ProfileImage src={comment.author.profilePic} alt='Profile' />
                ) : (
                  <UserIcon />
                )}
                <CommentUserName>{comment.author.name}</CommentUserName>
              </CommentUser>
              {userName === comment.author.name &&
                editingCommentId !== comment._id && (
                  <ActionButtons>
                    <TextButton onClick={() => handleEditClick(comment)}>
                      수정
                    </TextButton>
                    <Divider>|</Divider>
                    <TextButton
                      onClick={() => handleCommentDelete(comment._id)}
                    >
                      삭제
                    </TextButton>
                  </ActionButtons>
                )}
            </CommentAvatar>
            <CommentContent>
              {editingCommentId === comment._id ? (
                <form onSubmit={handleSubmit(handleEditSubmit)}>
                  <CommentInput
                    placeholder='수정할 내용을 입력해 주세요.'
                    {...register('editCommentText')}
                  />
                  <EditButton type='submit'>수정</EditButton>
                </form>
              ) : (
                <p>{comment.content}</p>
              )}
            </CommentContent>
            {currentComments.length > 1 &&
              index !== currentComments.length - 1 && <Hr />}
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

const CommentTitle = styled.p`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: -2px;
`;

const CommentInput = styled.textarea`
  width: 100%;
  padding: 1rem;
  margin-bottom: 0.625rem;
  border-radius: 0.325rem;
  border: 0.5px solid #c6c6c6;
  box-sizing: border-box;
  height: 5rem;
  font-size: 0.9rem;
  resize: none;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  margin-top: 10px;
`;

const CommentButton = styled.button`
  margin-left: auto;
  display: block;
  background-color: #543d20;
  color: white;
  padding: 0.4rem 0.9rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.875rem;
`;

const EditButton = styled.button`
  margin-left: auto;
  display: block;
  background-color: #543d20;
  color: white;
  padding: 0.4rem 0.9rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.875rem;
  margin-top: -6px;
  margin-bottom: 10px;
`;

const CommentList = styled.div`
  margin-top: 2rem;
`;

const CommentItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const CommentAvatar = styled.div`
  width: 100%;
  height: 2rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
  margin-right: 0.625rem;
  margin-bottom: 0.6rem;
`;

const CommentUser = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const CommentUserName = styled.p`
  font-size: 1rem;
  font-weight: 600;
`;

const CommentContent = styled.div`
  flex: 1;
  width: 100%;
  margin: -10px 0px 0px 3px;
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
  width: 1.7rem;
  height: 1.7rem;
  border-radius: 50%;
  margin-right: 7px;
`;

const Hr = styled.hr`
  border: none;
  border-top: 1px solid #ededed;
  width: 100%;
  margin: 5px 0px;
`;

const Divider = styled.span`
  color: #d7d7d7;
  margin: 0px -5px;
`;

export default CommentSection;

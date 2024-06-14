import React, { useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { ReactComponent as UserIcon } from '../../assets/icons/usericon.svg';

const CommentSection = ({
  selectedItem,
  userName,
  handleCommentSubmit,
  handleCommentDelete,
  handleCommentUpdate
}) => {
  const { register, handleSubmit, setValue } = useForm(); // setValue 추가
  const [editingCommentId, setEditingCommentId] = useState(null); // 상태 추가

  const handleEditClick = (comment) => {
    // 수정 버튼 클릭 핸들러 추가
    setEditingCommentId(comment._id);
    setValue('editCommentText', comment.content);
  };

  const handleEditSubmit = (data) => {
    // 수정 제출 핸들러 추가
    handleCommentUpdate(editingCommentId, data.editCommentText);
    setEditingCommentId(null);
  };

  return (
    <CommentSectionContainer>
      <FlexContainer>
        <h3>댓글</h3>
      </FlexContainer>
      <CommentInput
        placeholder='내용을 입력해 주세요.'
        {...register('commentText')}
      />
      <CommentButton onClick={handleSubmit(handleCommentSubmit)}>
        등록
      </CommentButton>
      <CommentList>
        {selectedItem.comments.map((comment) => (
          <CommentItem key={comment._id}>
            <CommentAvatar>
              <UserIcon />
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

export default CommentSection;

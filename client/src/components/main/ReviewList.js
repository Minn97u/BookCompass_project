import React from 'react';
import styled from 'styled-components';
import ReviewStar from './ReviewStar';

function ReviewList({
  reviewId,
  rating,
  comment,
  user,
  date,
  loggedInUserId,
  handleEditReview,
  userId
}) {
  const isEditable = loggedInUserId === userId;

  return (
    <ReviewListContainer>
      <ReviewStar rating={rating} />
      <ReviewContent>{comment}</ReviewContent>
      <ReviewInfo>
        <span>{user}</span>
        <span>{new Date(date).toLocaleDateString()}</span>
        {isEditable && <EditButton onClick={handleEditReview}>수정</EditButton>}
      </ReviewInfo>
    </ReviewListContainer>
  );
}

export default ReviewList;

const ReviewListContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  padding: 10px 0;
  border-bottom: 0.5px solid #dfdfdf; /* 수정된 부분 */
`;

const ReviewContent = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  padding: 10px 0;
`;

const ReviewInfo = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 11px;
  line-height: 18px;
  color: #868686;
  display: flex;
  align-items: center;
  & > span {
    margin-right: 10px;
  }
`;

const EditButton = styled.button`
  background-color: transparent;
  color: #007bff;
  border: none;
  cursor: pointer;
  margin-left: 10px;
`;

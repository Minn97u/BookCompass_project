import React, { useState } from 'react';
import styled from 'styled-components';
import ClickStar from './ClickStar';
import { postReview } from '../../api/Main';

function ReviewWrite({ onClose, placeId, userId, refreshReviews, placeType }) {
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  console.log('placeId:', placeId); // 디버깅용 로그
  console.log('userId:', userId); // 디버깅용 로그

  const handleReviewChange = (e) => {
    setReviewText(e.target.value);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('평점을 선택해주세요.');
      return;
    }

    try {
      console.log('리뷰 데이터:', {
        userId,
        placeId,
        rating,
        comment: reviewText,
        placeType // 추가
      });

      const response = await postReview(
        userId,
        placeId,
        placeType,
        rating,
        reviewText
      );

      alert('리뷰가 성공적으로 작성되었습니다.');
      onClose();
      refreshReviews(); // 리뷰 목록 갱신 함수 호출
    } catch (error) {
      console.error('리뷰 작성에 실패했습니다:', error);
      alert('리뷰 작성에 실패했습니다.');
    }
  };

  return (
    <ReviewWriteContainer>
      <Header>
        <ClickStar setRating={setRating} />
        <Button onClick={handleSubmit}>등록</Button>
      </Header>
      <ReviewInput>
        <input
          type='text'
          placeholder='리뷰를 작성해주세요'
          value={reviewText}
          onChange={handleReviewChange}
        />
      </ReviewInput>
    </ReviewWriteContainer>
  );
}

export default ReviewWrite;

const ReviewWriteContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  padding: 10px 0;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const ReviewInput = styled.div`
  width: 100%;
  padding: 10px 0;

  & > input {
    width: 100%;
    height: 102px;
    padding: 8px;
    font-size: 14px;
    border: 1px solid #dadada;
    border-radius: 5px;
    box-sizing: border-box;
  }
`;

const Button = styled.button`
  background: #563c0a;
  border-radius: 7px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 10px;
  line-height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #ffffff;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

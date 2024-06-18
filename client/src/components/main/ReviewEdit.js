import React, { useState } from 'react';
import styled from 'styled-components';
import ClickStar from './ClickStar';
import { editReview } from '../../api/Main'; // import your API function

const EditForm = ({ reviewId, onClose, refreshReviews }) => {
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);

  const handleReviewChange = (e) => {
    setReviewText(e.target.value);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('평점을 선택해주세요.');
      return;
    }

    try {
      console.log('Sending data to server:', {
        reviewId,
        rating,
        comment: reviewText
      });
      const response = await editReview(reviewId, rating, reviewText);
      alert('리뷰가 성공적으로 수정되었습니다.');
      onClose();
      refreshReviews(); // 리뷰 목록 갱신 함수 호출
    } catch (error) {
      if (error.response) {
        console.error('서버 응답 오류:', error.response.data);
        alert('서버 응답 오류: ' + error.response.data);
      } else {
        console.error('네트워크 오류:', error.message);
        alert('네트워크 오류: ' + error.message);
      }
    }
  };

  return (
    <ReviewWriteContainer>
      <Header>
        <ClickStar setRating={setRating} />
        <Button onClick={handleSubmit}>수정</Button>
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
};

export default EditForm;

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

import React from 'react';
import styled from 'styled-components';
import ReviewStar from './ReviewStar';

function ReviewList({ rating }) {
  return (
    <>
      <ReviewListContainer>
        <ReviewStar rating={rating} />
        <ReviewContent>
          책이 아주 많진 않지만 읽을 만한 책은 제법 있고, 분위기 좋고 분위기
          좋습니다. 휴식이 필요할 때 여기오면 힐링 그 자체입니다.
        </ReviewContent>
        <ReviewInfo>
          <span>Name</span>
          <span>Date</span>
        </ReviewInfo>
      </ReviewListContainer>
    </>
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
  /* or 129% */
`;

const ReviewInfo = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 11px;
  line-height: 18px;
  color: #868686;
  & > span {
    margin-right: 10px;
  }
`;

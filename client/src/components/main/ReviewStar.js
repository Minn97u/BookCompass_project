import React from 'react';
import styled from 'styled-components';
import { ReactComponent as StarIcon } from '../../assets/icons/StarIcon.svg';
import { ReactComponent as EmptyStarIcon } from '../../assets/icons/EmptyStar.svg';

const ReviewStar = ({ rating }) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < rating) {
      stars.push(<StyledStarIcon key={i} />);
    } else {
      stars.push(<StyledEmptyStarIcon key={i} />);
    }
  }

  return (
    <StarRatingContainer>
      <StarContainer>{stars}</StarContainer>
      <VerticalLine /> {/* 세로선 */}
      <RatingContainer>
        <Rating>{rating.toFixed(1)}</Rating>
      </RatingContainer>
    </StarRatingContainer>
  );
};

export default ReviewStar;

const StarRatingContainer = styled.div`
  /* 별 아이콘 및 별점 숫자 컨테이너 스타일 */
  display: flex;
  align-items: center;
  margin-bottom: 4px;
`;

const StarContainer = styled.div`
  /* 별 아이콘 컨테이너 스타일 */
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 120px;
  height: 20px;
`;

const StyledStarIcon = styled(StarIcon)`
  /* 별 아이콘 스타일 */
  width: 20px;
  height: 20px;
  flex: none;
  order: 3;
  flex-grow: 0;
`;

const StyledEmptyStarIcon = styled(EmptyStarIcon)`
  /* 빈 별 아이콘 스타일 */
  box-sizing: border-box;
  width: 20px;
  height: 20px;
  background: #ffffff;
  border-radius: 1px;
  flex: none;
  order: 4;
  flex-grow: 0;
`;

const VerticalLine = styled.div`
  /* 세로선 스타일 */
  width: 1px;
  height: 15px;
  background-color: #ccc;
  margin-left: -10px;
  margin-right: 5px;
`;

const RatingContainer = styled.div`
  /* 별점 숫자 컨테이너 스타일 */
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Rating = styled.span`
  /* 별점 숫자 스타일 */
  margin-left: 5px;
  font-size: 13px;
  color: #333333;
  order: 5;
  margin-top: 3px;
`;

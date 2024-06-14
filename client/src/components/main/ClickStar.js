import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ReactComponent as StarIcon } from '../../assets/icons/StarIcon.svg';
import { ReactComponent as EmptyStarIcon } from '../../assets/icons/EmptyStar.svg';

const ClickStar = ({ setRating }) => {
  const [rating, setLocalRating] = useState(0);

  useEffect(() => {
    setRating(rating);
  }, [rating, setRating]);

  return (
    <StarContainer>
      {[...Array(rating)].map((_, i) => (
        <Star key={i} onClick={() => setLocalRating(i + 1)} />
      ))}
      {[...Array(5 - rating)].map((_, i) => (
        <EmptyStar key={i} onClick={() => setLocalRating(rating + i + 1)} />
      ))}
      <RatingText>{rating}</RatingText>
    </StarContainer>
  );
};

export default ClickStar;

const StarContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Star = styled(StarIcon)`
  width: 1.3rem;
  height: 1.2rem;
  cursor: pointer; /* 추가: 클릭할 수 있음을 나타내는 포인터 커서 */
`;

const EmptyStar = styled(EmptyStarIcon)`
  width: 1.3rem;
  height: 1.2rem;
  cursor: pointer; /* 추가: 클릭할 수 있음을 나타내는 포인터 커서 */
`;

const RatingText = styled.span`
  font-size: 1rem;
  margin-left: 12px;
`;

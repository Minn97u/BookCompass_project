import React, { useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as StarIcon } from '../../assets/icons/StarIcon.svg';
import { ReactComponent as EmptyStarIcon } from '../../assets/icons/EmptyStar.svg';

const ClickStar = () => {
  const [rating, setRating] = useState(0);

  return (
    <StarContainer>
      {[...Array(rating)].map((a, i) => (
        <Star key={i} onClick={() => setRating(i + 1)} />
      ))}
      {[...Array(5 - rating)].map((a, i) => (
        <EmptyStar key={i} onClick={() => setRating(rating + i + 1)} />
      ))}
      <RatigText>{rating}</RatigText>
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
`;

const EmptyStar = styled(EmptyStarIcon)`
  width: 1.3rem;
  height: 1.2rem;
`;

const RatigText = styled.span`
  font-size: 1rem;
  margin-left: 12px;
`;

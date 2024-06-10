import React from 'react';
import styled from 'styled-components';
import { ReactComponent as StarIcon } from '../../assets/icons/StarIcon.svg';
import { ReactComponent as EmptyStarIcon } from '../../assets/icons/EmptyStar.svg';
import DeleteIcon from '../../assets/icons/DeleteIcon.svg';

const ReviewList = () => {
  const ratings = [1, 3, 5];
  const reviewComments = [
    '책이 아주 많진 않지만 읽을 만한 책은 제법 있고, 분위기 좋습니다. 휴식이 필요할 때 여기오면 힐링 그 자체입니다.',
    '휴식이 필요할 때 여기오면 힐링 그 자체입니다.',
    '리뷰 예시'
  ];

  return (
    <div>
      {ratings.map((rating, index) => (
        <ReviewGroup key={index}>
          <StarContainer>
            {[...Array(rating)].map((i) => (
              <Star key={i} />
            ))}
            {[...Array(5 - rating)].map((i) => (
              <EmptyStar key={i} />
            ))}
            <RatingText>{rating}</RatingText>
          </StarContainer>
          <TextContainer>
            <ReviewText>{reviewComments[index]}</ReviewText>
            <DeleteWrite>
              <DeleteIconImg src={DeleteIcon} alt='delete-icon' />
            </DeleteWrite>
          </TextContainer>
          {ratings.length > 1 && index !== ratings.length - 1 && <Hr />}
        </ReviewGroup>
      ))}
    </div>
  );
};

export default ReviewList;

const ReviewGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;

const StarContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const Star = styled(StarIcon)`
  width: 1.3rem;
  height: 1.2rem;
`;

const EmptyStar = styled(EmptyStarIcon)`
  width: 1.3rem;
  height: 1.2rem;
`;

const RatingText = styled.span`
  font-size: 1.1rem;
  margin-left: 12px;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
`;

const ReviewText = styled.div`
  font-size: 1.1rem;
`;

const DeleteWrite = styled.button`
  border: none;
  background-color: transparent;
`;

const DeleteIconImg = styled.img`
  width: 1.2rem;
  cursor: pointer;
  margin-left: 60px;
`;

const Hr = styled.hr`
  border: none;
  border-top: 1px solid #ededed;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
`;

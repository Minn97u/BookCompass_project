import React, { useState } from 'react';
import styled from 'styled-components';
import ReviewStar from './ReviewStar';
import WriteReviewIcon from '../../assets/icons/WriteReviewIcon.svg';
import BackIcon from '../../assets/icons/BackIcon.svg';
import ModalReviewWriteContainer from '../main/ModalReviewWriteContainer';
import ModalReviewListContainer from './ModalReviewListContainer';

const ModalReviewContainer = ({ rating }) => {
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [iconImage, setIconImage] = useState(WriteReviewIcon);

  const handleWriteReviewClick = () => {
    setIsWriteReviewOpen(true);
    setIconImage(BackIcon);
  };

  const handleBackIconClick = () => {
    setIsWriteReviewOpen(false);
    setIconImage(WriteReviewIcon);
  };

  return (
    <Container>
      <ReviewTitle>
        <TitleText>
          <span>리뷰(1)</span>
          <span>
            <ReviewStar rating={rating} />
          </span>
        </TitleText>
        <WriteReviewIconWrapper
          onClick={
            isWriteReviewOpen ? handleBackIconClick : handleWriteReviewClick
          }
        >
          <img src={iconImage} alt='WriteReviewIcon' />
        </WriteReviewIconWrapper>
      </ReviewTitle>

      {isWriteReviewOpen ? (
        <ModalReviewWriteContainer />
      ) : (
        <ModalReviewListContainer rating={rating} />
      )}
    </Container>
  );
};

export default ModalReviewContainer;

const Container = styled.div`
  top: 50%;
  padding: 20px 0;
  border-radius: 0 0 20px 20px;
  width: 100%;
`;

const ReviewTitle = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 18px;
  color: #191619;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 20px;
  width: 100%;
  border-bottom: 0.5px solid #c0c0c0;
  box-sizing: border-box;
  padding-bottom: 5px;
`;

const TitleText = styled.div`
  display: flex;
  align-items: center;
  & > span {
    margin-right: 10px;
  }
  flex-grow: 1;
`;

const WriteReviewIconWrapper = styled.span`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 0;
`;

import React, { useState } from 'react';
import styled from 'styled-components';
import ReviewStar from './ReviewStar';
import WriteReviewIcon from '../../assets/icons/WriteReviewIcon.svg';
import BackIcon from '../../assets/icons/BackIcon.svg'; // BackIcon을 가져옵니다.
import ModalReviewWriteContainer from '../main/ModalReviewWriteContainer'; // ModalReviewWriteContainer를 가져옵니다.
import ModalReviewListContainer from './ModalReviewListContainer';

const ModalReviewContainer = ({ rating }) => {
  // 상태를 사용하여 WriteReviewIcon 클릭 여부를 추적합니다.
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  // 아이콘 이미지를 바꾸기 위한 상태 추가
  const [iconImage, setIconImage] = useState(WriteReviewIcon);

  // WriteReviewIcon을 클릭할 때 상태를 변경하여 모달을 표시합니다.
  const handleWriteReviewClick = () => {
    setIsWriteReviewOpen(true);
    // 아이콘 이미지를 BackIcon으로 변경
    setIconImage(BackIcon);
  };

  // BackIcon을 클릭할 때 다시 WriteReviewIcon으로 변경합니다.
  const handleBackIconClick = () => {
    setIsWriteReviewOpen(false);
    // 아이콘 이미지를 WriteReviewIcon으로 변경
    setIconImage(WriteReviewIcon);
  };

  return (
    <Container>
      <ReviewTitle>
        <span>리뷰(1)</span>
        <span>
          <ReviewStar rating={rating} />
        </span>

        {/* WriteReviewIcon 클릭 이벤트를 처리합니다. */}
        <WriteReviewIconWrapper
          onClick={
            isWriteReviewOpen ? handleBackIconClick : handleWriteReviewClick
          }
        >
          <img src={iconImage} alt='WriteReviewIcon' />{' '}
          {/* 아이콘 이미지 변경 */}
        </WriteReviewIconWrapper>
      </ReviewTitle>

      {/* isWriteReviewOpen이 true인 경우 ModalReviewWriteContainer를 표시합니다. */}
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
  & > span {
    margin-right: 10px;
  }
`;

const WriteReviewIconWrapper = styled.span`
  display: flex;
  align-items: center;
  margin-left: auto;
`;

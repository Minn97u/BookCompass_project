import React, { useState } from 'react';
import styled from 'styled-components';
import BookIcon from '../../assets/icons/BookIcon.svg';
import CloseIcon from '../../assets/icons/CloseIcon.svg';
import ModalReviewContainer from './ModalReviewContainer'; // ReviewContainer를 가져옴
import ArchiveAddIconSrc from '../../assets/icons/ArchiveAdd.svg';
import ArchiveAddedIconSrc from '../../assets/icons/ArchivePreAddIcon.svg';

const Modal = ({ isOpen, closeModal, library }) => {
  const [archiveAdded, setArchiveAdded] = useState(false);

  const handleArchiveButtonClick = () => {
    // 현재 상태의 반대로 변경
    setArchiveAdded(!archiveAdded);
  };

  if (!isOpen) return null;

  return (
    <ModalContainer onClick={closeModal}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={closeModal}>
          <img src={CloseIcon} alt='CloseIcon' />
        </CloseButton>
        <LibraryNameContainer>
          <LibraryIcon src={BookIcon} alt='BookIcon' />
          <LibraryName>{library['도서관명']}</LibraryName>
          <DistrictName>{library['구명']}</DistrictName>
        </LibraryNameContainer>
        <LibraryAddress>
          {library['주소']}
          <ArchiveAddButton onClick={handleArchiveButtonClick}>
            <img
              src={archiveAdded ? ArchiveAddedIconSrc : ArchiveAddIconSrc}
              alt='ArchiveIcon'
            />
          </ArchiveAddButton>
        </LibraryAddress>
        <LibraryOperatingHours>
          <OperatingHoursLabel>운영시간</OperatingHoursLabel>
          {library['운영시간']}
        </LibraryOperatingHours>
        <LibraryPhone>{library['전화번호']}</LibraryPhone>
        <LibraryURL
          href={library['홈페이지 URL']}
          target='_blank'
          rel='noopener noreferrer'
        >
          {library['홈페이지 URL']}
        </LibraryURL>
        <ModalReviewContainer rating={4} /> {/* ReviewContainer를 사용 */}
      </ModalContent>
    </ModalContainer>
  );
};

export default Modal;

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 50px;

  position: absolute;
  width: 350px;
  height: 400px;
  left: 40%;
  top: 15%;

  background: #ffffff;
  box-shadow: 0px 4px 18px rgba(0, 0, 0, 0.24);
  border-radius: 20px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  margin: 20px;
`;

const ArchiveAddButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

const LibraryNameContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px; /* 아이콘과 이름 사이의 간격 조절 */
`;

const LibraryIcon = styled.img`
  margin-right: 10px; /* 아이콘과 이름 사이의 간격 조절 */
`;

const LibraryName = styled.span`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 16px;
  color: #191619;
`;

const DistrictName = styled.span`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;
  color: #563c0a;
  position: absolute;
  right: 4rem;
`;

const LibraryAddress = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  width: 100%;
  margin-top: 10px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 18px;
  color: #191619;
`;

const LibraryOperatingHours = styled.div`
  margin-top: 10px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: #191619;
  display: flex;
  align-items: center;
`;

const OperatingHoursLabel = styled.span`
  font-weight: bold;
  margin-right: 5px;
`;

const LibraryPhone = styled.p`
  margin-top: 10px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 18px;
  color: #191619;
`;

const LibraryURL = styled.a`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: #3e91f4;
  position: absolute;
  width: 365px;
  height: 16px;
  left: 978px;
  top: 544px;
`;

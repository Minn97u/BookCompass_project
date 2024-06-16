import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import BookIcon from '../../assets/icons/BookIcon.svg';
import CloseIcon from '../../assets/icons/CloseIcon.svg';
import Review from './Review';
import ArchiveAddIconSrc from '../../assets/icons/ArchiveAdd.svg';
import ArchiveAddedIconSrc from '../../assets/icons/ArchivePreAddIcon.svg';

const Modal = ({ isOpen, closeModal, place, type }) => {
  const [archiveAdded, setArchiveAdded] = useState(false);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    // 모달이 열릴 때마다 찜하기 상태를 설정
    if (place && place.favorite !== undefined) {
      setArchiveAdded(place.favorite);
    }

    // place가 있을 때 평균 평점을 가져옴
    if (place && type === 'library') {
      axios
        .get(`/api/libraries/${place._id}`)
        .then((response) => {
          setAverageRating(response.data.averageRating || 0);
        })
        .catch((error) => {
          console.error('평균 평점을 가져오는 중 오류 발생:', error);
        });
    }
  }, [isOpen, place, type]);

  const handleArchiveButtonClick = async () => {
    try {
      let endpoint = '';
      let data = {};
      console.log(place._id);
      console.log('즐찾 버튼 클릭');

      if (type === 'library') {
        if (archiveAdded) {
          endpoint = '/api/libraries/removeFavoriteLibrary';
        } else {
          endpoint = '/api/libraries/favoriteLibraries';
        }
        data = { libraryId: place._id };
      } else if (type === 'park') {
        if (archiveAdded) {
          endpoint = '/api/parks/removeFavoritePark';
        } else {
          endpoint = '/api/parks/favoriteParks';
        }
        data = { parkId: place._id };
      }

      const response = await axios.post(endpoint, data);

      alert(response.data);

      // API 요청 후 찜하기 상태 업데이트
      setArchiveAdded(!archiveAdded); // 상태 토글
    } catch (error) {
      if (error.response) {
        alert(error.response.data);
      } else {
        console.error('찜하기 중 오류 발생:', error.message);
        alert('오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  if (!isOpen || !place) return null; // isOpen이 false이거나 place가 null인 경우 모달 닫기

  return (
    <ModalContainer onClick={closeModal}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={closeModal}>
          <img src={CloseIcon} alt='CloseIcon' />
        </CloseButton>
        <PlaceNameContainer>
          <LibraryIcon src={BookIcon} alt='BookIcon' />
          <PlaceName>{place.name || '장소 이름 없음'}</PlaceName>
          <DistrictName>{place.district || '구 이름 없음'}</DistrictName>
        </PlaceNameContainer>
        <PlaceAddress>
          {place.address || '주소 없음'}
          <ArchiveAddButton onClick={handleArchiveButtonClick}>
            <img
              src={archiveAdded ? ArchiveAddedIconSrc : ArchiveAddIconSrc}
              alt='ArchiveIcon'
            />
          </ArchiveAddButton>
        </PlaceAddress>
        <PlaceOperatingHours>
          {place.hours || '운영시간 정보 없음'}
        </PlaceOperatingHours>
        <PlacePhone>{place.phone || '전화번호 없음'}</PlacePhone>
        <PlaceURL
          href={place.url || '#'}
          target='_blank'
          rel='noopener noreferrer'
        >
          {place.url || '홈페이지 URL 없음'}
        </PlaceURL>
        <Review rating={averageRating} placeId={place._id} />
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

const PlaceNameContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  width: 70%;
`;

const LibraryIcon = styled.img`
  margin-right: 10px;
`;

const PlaceName = styled.span`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 18px;
  color: #191619;
  text-align: left;
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

const PlaceAddress = styled.div`
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

const PlaceOperatingHours = styled.div`
  margin-top: 10px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: #191619;
  display: flex;
  text-align: left;
  align-items: center;
`;

const PlacePhone = styled.p`
  margin-top: 10px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 18px;
  color: #191619;
  text-align: left;
`;

const PlaceURL = styled.a`
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
  text-align: left;
`;

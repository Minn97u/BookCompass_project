import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { debounce } from 'lodash';
import FindLibrary from '../../src/assets/icons/FindLibrary.svg';
import LibraryParkMap from '../components/main/LibraryParkMap';
import Modal from '../components/main/Modal';
import LibraryList from '../components/main/LibraryList';
import ParkList from '../components/main/ParkList';
import AuthModal from '../components/auth/AuthModal';
import {
  getLibraryPings,
  getParkPings,
  getLibraryFav,
  getParkFav,
  getDustData
} from '../api/Main';
import { getLoginStatus } from '../api/Auth';

const districts = [
  { name: '강남구', center: { lat: 37.5172, lng: 127.0473 } },
  { name: '강동구', center: { lat: 37.5301, lng: 127.1237 } },
  { name: '강북구', center: { lat: 37.6396, lng: 127.0255 } },
  { name: '강서구', center: { lat: 37.5509, lng: 126.8495 } },
  { name: '관악구', center: { lat: 37.4784, lng: 126.9516 } },
  { name: '광진구', center: { lat: 37.5384, lng: 127.0822 } },
  { name: '구로구', center: { lat: 37.4955, lng: 126.887 } },
  { name: '금천구', center: { lat: 37.4569, lng: 126.8958 } },
  { name: '노원구', center: { lat: 37.6543, lng: 127.0568 } },
  { name: '도봉구', center: { lat: 37.6688, lng: 127.0467 } },
  { name: '동대문구', center: { lat: 37.5743, lng: 127.0395 } },
  { name: '동작구', center: { lat: 37.5124, lng: 126.9396 } },
  { name: '마포구', center: { lat: 37.5663, lng: 126.901 } },
  { name: '서대문구', center: { lat: 37.5791, lng: 126.9368 } },
  { name: '서초구', center: { lat: 37.4836, lng: 127.0327 } },
  { name: '성동구', center: { lat: 37.5634, lng: 127.0366 } },
  { name: '성북구', center: { lat: 37.5894, lng: 127.0164 } },
  { name: '송파구', center: { lat: 37.5145, lng: 127.1059 } },
  { name: '양천구', center: { lat: 37.5169, lng: 126.8666 } },
  { name: '영등포구', center: { lat: 37.5262, lng: 126.8961 } },
  { name: '용산구', center: { lat: 37.5324, lng: 126.99 } },
  { name: '은평구', center: { lat: 37.6028, lng: 126.9293 } },
  { name: '종로구', center: { lat: 37.572, lng: 126.9794 } },
  { name: '중구', center: { lat: 37.5633, lng: 126.9978 } },
  { name: '중랑구', center: { lat: 37.6063, lng: 127.0922 } }
];

const Main = () => {
  const [keyword, setKeyword] = useState('');
  const [libraries, setLibraries] = useState([]);
  const [parks, setParks] = useState([]);
  const [selectedLibrary, setSelectedLibrary] = useState(null);
  const [selectedPark, setSelectedPark] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedButton, setSelectedButton] = useState('library');
  const [mapCenter, setMapCenter] = useState({});
  const [selectedGu, setSelectedGu] = useState('');
  const [archiveAdded, setArchiveAdded] = useState({});
  const [mapLevel, setMapLevel] = useState('8');
  const [dustData, setDustData] = useState(null); // 미세먼지 정보 상태 추가
  const [parkDustInfo, setParkDustInfo] = useState(null); // 공원 미세먼지 정보 상태 추가

  useEffect(() => {
    const fetchLibraryPings = async () => {
      try {
        const libraryData = await getLibraryPings();
        setLibraries(libraryData);
      } catch (error) {
        console.error('Error fetching libraries:', error);
      }
    };

    const fetchParkPings = async () => {
      try {
        const parkData = await getParkPings();
        setParks(parkData);
      } catch (error) {
        console.error('Error fetching parks:', error);
      }
    };

    const fetchLibraryFavs = async () => {
      try {
        const libraryFavs = await getLibraryFav();
        const libraryFavsMap = libraryFavs.map((item) => ({
          id: item._id
        }));
        setArchiveAdded((prevState) => ({
          ...prevState,
          libraryFavs: libraryFavsMap
        }));
      } catch (error) {
        console.error('Error fetching library favorites:', error);
      }
    };

    const fetchParkFavs = async () => {
      try {
        const parkFavs = await getParkFav();
        const parkFavsMap = parkFavs.map((item) => ({
          id: item._id
        }));
        setArchiveAdded((prevState) => ({
          ...prevState,
          parkFavs: parkFavsMap
        }));
      } catch (error) {
        console.error('Error fetching park favorites:', error);
      }
    };

    fetchLibraryPings();
    fetchParkPings();
    fetchLibraryFavs();
    fetchParkFavs();
  }, []);

  const debouncedSetKeyword = useCallback(
    debounce((value) => setKeyword(value), 500),
    []
  );

  const handleLibraryItemClick = (library) => {
    setSelectedLibrary(library);
    setMapCenter({ lat: library.latitude, lng: library.longitude });
    setMapLevel('3');
  };

  const handleParkItemClick = (park) => {
    setSelectedPark(park);
    setMapCenter({ lat: park.latitude, lng: park.longitude });
    setMapLevel('3');
  };

  const checkLoginAndOpenModal = async (place, type) => {
    try {
      const response = await getLoginStatus();
      if (response.data.loggedIn) {
        setSelectedLibrary(type === 'library' ? place : null);
        setSelectedPark(type === 'park' ? place : null);
        setIsModalOpen(true);
      } else {
        setIsLoginModalOpen(true);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      setIsLoginModalOpen(true);
    }
  };

  const handleLibraryClick = (library) => {
    checkLoginAndOpenModal(library, 'library');
  };

  const handleParkClick = (park) => {
    checkLoginAndOpenModal(park, 'park');
  };

  const handleButtonClick = async (buttonType) => {
    setSelectedButton(buttonType);
    if (buttonType === 'park') {
      try {
        const dustResponse = await getDustData(); // 미세먼지 데이터 가져오기
        console.log('Dust Response:', dustResponse); // API 호출 결과를 콘솔에 출력
        setDustData(dustResponse);
        console.log(dustData);
        setParkDustInfo({
          dataTime: dustResponse[0].dataTime,
          pm10: dustResponse[0].pm10Value, // 미세먼지 농도
          khaiGrade: dustResponse[0].khaiGrade // 대기질 점수
        });
      } catch (error) {
        console.error('Error fetching dust data:', error);
      }
    } else {
      setParkDustInfo(null); // 도서관 버튼을 클릭하면 미세먼지 정보 초기화
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setMapLevel('8');
    setParkDustInfo(null); // 모달 닫을 때 미세먼지 정보 초기화
  };

  const handleChangeGu = (e) => {
    setSelectedGu(e.target.value);
    setMapLevel('8');
    setKeyword('');
  };

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const selectedDistrict = districts.find(
      (district) => district.name === selectedGu
    );
    if (selectedDistrict) {
      setMapCenter(selectedDistrict.center);
    }
  }, [selectedGu]);

  const filteredLibraries = libraries.filter(
    (library) => selectedGu === '' || library.district === selectedGu
  );

  const filteredParks = parks.filter(
    (park) => selectedGu === '' || park.district === selectedGu
  );

  useEffect(() => {
    if (isModalOpen) {
      if (selectedLibrary) {
        setMapCenter({
          lat: selectedLibrary.latitude,
          lng: selectedLibrary.longitude
        });
      } else if (selectedPark) {
        setMapCenter({
          lat: selectedPark.latitude,
          lng: selectedPark.longitude
        });
      } else {
        setMapCenter({ lat: 37.5665, lng: 126.978 });
      }
    }
  }, [isModalOpen, selectedLibrary, selectedPark]);

  const handleKeywordChange = (e) => {
    debouncedSetKeyword(e.target.value);
  };

  return (
    <FullHeightContainer>
      <Guide as={HBox}>
        <Flex flex={1}>
          <>
            <InputContainer>
              <KeywordInputContainer>
                <Input
                  type='text'
                  placeholder='도서관 검색'
                  value={keyword}
                  onChange={handleKeywordChange}
                />
                <ClickableIconContainer>
                  <FindLibraryIcon src={FindLibrary} alt='FindLibrary' />
                </ClickableIconContainer>
              </KeywordInputContainer>
              <LabelContainer>
                <Label>설정한 위치</Label>
                <Select value={selectedGu} onChange={handleChangeGu}>
                  <option value=''>전체</option>
                  {districts.map((gu) => (
                    <option key={gu.name} value={gu.name}>
                      {gu.name}
                    </option>
                  ))}
                </Select>
              </LabelContainer>
            </InputContainer>
            <ListContainer>
              {selectedButton === 'library' ? (
                <LibraryList
                  libraries={filteredLibraries}
                  keyword={keyword}
                  handleLibraryItemClick={handleLibraryItemClick}
                />
              ) : (
                <ParkList
                  parks={filteredParks}
                  keyword={keyword}
                  handleParkItemClick={handleParkItemClick}
                />
              )}
            </ListContainer>
          </>
        </Flex>
        <Flex flex={4}>
          <LibraryParkMapContainer>
            <LibraryParkMap
              libraries={filteredLibraries}
              parks={filteredParks}
              searchTerm={keyword}
              onLibraryClick={handleLibraryClick}
              onParkClick={handleParkClick}
              selectedButton={selectedButton}
              center={mapCenter}
              mapLevel={mapLevel}
            />
            <ButtonContainer>
              <Button
                onClick={() => handleButtonClick('library')}
                selected={selectedButton === 'library'}
              >
                도서관
              </Button>
              <Button
                onClick={() => handleButtonClick('park')}
                selected={selectedButton === 'park'}
              >
                책 읽기 좋은 공원
              </Button>
            </ButtonContainer>
            {parkDustInfo && selectedButton === 'park' && (
              <DustInfo khaiGrade={parkDustInfo.khaiGrade}>
                <Heading>대기 정보</Heading>
                <Paragraph>일시: {parkDustInfo.dataTime}</Paragraph>
                <Paragraph>대기질 점수: {parkDustInfo.khaiGrade}</Paragraph>
                <Paragraph>미세먼지 농도: {parkDustInfo.pm10} µg/m³</Paragraph>
              </DustInfo>
            )}
          </LibraryParkMapContainer>
        </Flex>
      </Guide>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          closeModal={handleModalClose}
          place={selectedButton === 'library' ? selectedLibrary : selectedPark}
          type={selectedButton === 'library' ? 'library' : 'park'}
          userId={userId}
          archiveAdded={archiveAdded}
          setArchiveAdded={(isAdded) => {
            setArchiveAdded(isAdded);
          }}
        />
      )}
      {isLoginModalOpen && (
        <AuthModal
          onClose={() => setIsLoginModalOpen(false)}
          initialFormType='로그인'
        /> // AuthModal 사용
      )}
    </FullHeightContainer>
  );
};

export default Main;

const DustInfo = styled.div`
  margin-top: 5px;

  background-color: ${(props) => (props.khaiGrade >= 3 ? 'orange' : 'green')};
  color: white;
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 3;
  border-radius: 15px; /* Use a smaller border-radius for a rounded rectangle */
  letter-spacing: -0.5px;
  height: auto; /* Allow height to adjust based on content */
  width: 200px; /* Set a fixed width */
  box-sizing: border-box;
  text-align: left;
  -left: 10px;
  padding-left: 10px;
`;

const Paragraph = styled.p`
  font-family: 'SUIT';
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  margin: 2px 0; /* Adjust the top and bottom margins as needed */
  letter-spacing: -0.5px; /* Adjust letter spacing if needed */
`;
const Heading = styled.h4`
  margin: 5px 0; /* Adjust the top and bottom margins as needed */
`;

const LibraryParkMapContainer = styled.div`
  position: relative;
  z-index: 0;
`;

const ButtonContainer = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
  margin: 8px 0px 0px 15px;
`;

const Button = styled.button`
  background: ${(props) => (props.selected ? '#563C0A' : 'white')};
  color: ${(props) => (props.selected ? 'white' : '#563C0A')};
  border: 1px solid #563c0a;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  font-size: 14px;
  padding: 7px 15px;
  margin-right: 10px;
  cursor: pointer;
`;

const FullHeightContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 0.5px solid #ae9d8a;
`;

const HBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  flex: 1;
`;

const Flex = styled.div`
  flex: ${(props) => props.flex || 1};
  display: flex;
  flex-direction: column;

  ::-webkit-scrollbar {
    width: 7px;
    background-color: #f1f1f1;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #888; /* 스크롤바의 색상 설정 */
    border-radius: 5px; /* 스크롤바의 모서리 반경 설정 */
  }
`;

const Guide = styled.div`
  > * {
    outline: 1px solid #c4c4c4;
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 15px;
`;

const Input = styled.input`
  width: 17.5rem;
  height: 1.5rem;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  padding: 5px 12px;
  margin: 0px 0px 15px 8px;

  &::placeholder {
    color: #bababa;
  }
`;

const KeywordInputContainer = styled.div`
  position: relative;
`;

const ClickableIconContainer = styled.div`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
`;

const FindLibraryIcon = styled.img`
  margin-bottom: 0.7rem;
`;

const LabelContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Label = styled.span`
  margin: 0 10px;
  font-family: 'SUIT';
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 16px;
  color: ${(props) => props.color || '#191619'};
`;

const Select = styled.select`
  height: 1.6rem;
  margin-top: 0px;
  padding: 5px;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  font-size: 11px;
  font-family: 'SUIT';
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 15px;
  height: 50rem;

  ::-webkit-scrollbar {
    width: 3px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #888; /* 스크롤바의 색상 설정 */
    border-radius: 5px; /* 스크롤바의 모서리 반경 설정 */
  }
`;

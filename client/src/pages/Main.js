import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import FindLibrary from '../../src/assets/icons/FindLibrary.svg';
import LibraryParkMap from '../components/main/LibraryParkMap';
import Modal from '../components/main/Modal';
import LibraryList from '../components/main/LibraryList';
import ParkList from '../components/main/ParkList';
import {
  getLibraryPings,
  getParkPings,
  getLibraryFav,
  getParkFav
} from '../api/Main';

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
  const [selectedButton, setSelectedButton] = useState('library');
  const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.978 });
  const [selectedGu, setSelectedGu] = useState('');
  const [archiveAdded, setArchiveAdded] = useState({}); // archiveAdded 상태를 객체로 관리

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
        const libraryFavsMap = libraryFavs.reduce((acc, item) => {
          acc[item._id] = true; // ID를 키로 하고 값을 true로 설정
          return acc;
        }, {});
        console.log('도서관 즐찾', libraryFavsMap);
        setArchiveAdded((prevState) => ({
          ...prevState,
          ...libraryFavsMap
        }));
      } catch (error) {
        console.error('Error fetching library favorites:', error);
      }
    };

    const fetchParkFavs = async () => {
      try {
        const parkFavs = await getParkFav();
        const parkFavsMap = parkFavs.reduce((acc, item) => {
          acc[item._id] = true; // ID를 키로 하고 값을 true로 설정
          return acc;
        }, {});
        setArchiveAdded((prevState) => ({
          ...prevState,
          ...parkFavsMap
        }));
      } catch (error) {
        console.error('Error fetching park favorites:', error);
      }
    };

    fetchLibraryPings();
    fetchParkPings();
    fetchLibraryFavs();
    fetchParkFavs();
    console.log('즐찾???', archiveAdded);
  }, []);

  const handleFindLibraryClick = () => {
    console.log(keyword);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      console.log(keyword);
    }
  };

  const handleLibraryItemClick = (library) => {
    setSelectedLibrary(library);
    setMapCenter({ lat: library.latitude, lng: library.longitude });
  };

  const handleParkItemClick = (park) => {
    setSelectedPark(park);
    setMapCenter({ lat: park.latitude, lng: park.longitude });
  };

  const handleLibraryClick = (library) => {
    setSelectedLibrary(library);
    setIsModalOpen(true);
  };

  const handleParkClick = (park) => {
    setSelectedPark(park);
    setIsModalOpen(true);
  };

  const handleButtonClick = (buttonType) => {
    setSelectedButton(buttonType);
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
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <ClickableIconContainer onClick={handleFindLibraryClick}>
                  <FindLibraryIcon src={FindLibrary} alt='FindLibrary' />
                </ClickableIconContainer>
              </KeywordInputContainer>
              <LabelContainer>
                <Label>설정한 위치</Label>
                <Select
                  value={selectedGu}
                  onChange={(e) => setSelectedGu(e.target.value)}
                >
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
                공원
              </Button>
            </ButtonContainer>
          </LibraryParkMapContainer>
        </Flex>
      </Guide>
      <Modal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        place={selectedButton === 'library' ? selectedLibrary : selectedPark}
        type={selectedButton === 'library' ? 'library' : 'park'}
        userId={userId}
        archiveAdded={
          archiveAdded[
            selectedButton === 'library'
              ? selectedLibrary?._id
              : selectedPark?._id
          ] || false
        } // 개별 장소별 archiveAdded 상태 전달
        setArchiveAdded={(isAdded) => {
          const id =
            selectedButton === 'library'
              ? selectedLibrary._id
              : selectedPark._id;
          setArchiveAdded((prevState) => ({
            ...prevState,
            [id]: isAdded
          }));
        }} // archiveAdded 상태를 개별 장소별로 설정
      />
    </FullHeightContainer>
  );
};

export default Main;

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
  align-items: center; // 수직 방향 중앙 정렬
  justify-content: center; // 수평 방향 중앙 정렬
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
  justify-content: center;
  padding: 0px 15px;
`;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FindLibrary from '../../src/assets/icons/FindLibrary.svg';
import styled from 'styled-components';
import InvisibleIcon from '../../src/assets/icons/InvisibleIcon.svg';
import VisibleIcon from '../../src/assets/icons/VisibleIcon.svg';
import LibraryParkMap from '../components/LibraryParkMap';

const Main = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleFindLibraryClick = () => {
    console.log(keyword);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      console.log(keyword);
    }
  };

  return (
    <FullHeightContainer>
      <Guide as={HBox}>
        {/* Container */}
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
                <Label style={{ color: '#563C0A' }}>00구</Label>
              </LabelContainer>
            </InputContainer>
          </>
        </Flex>
        {/* Content */}
        <Flex flex={4}>
          <LibraryParkMap />
        </Flex>
        {/* Content */}
      </Guide>
    </FullHeightContainer>
  );
};

export default Main;

const FullHeightContainer = styled.div`
  height: 100vh; /* 화면 전체 높이 */
  display: flex;
  flex-direction: column;
`;

const HBox = styled.div`
  display: flex;
  flex-direction: row; /* 세로로 배치 */
  align-items: stretch;
  flex: 1;
`;

const Flex = styled.div`
  flex: ${(props) => props.flex || 1};
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
  width: 16rem;
  height: 1.5rem;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  padding: 5px 12px 5px 12px;
  margin-bottom: 15px;

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
  margin-top: 10px;
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

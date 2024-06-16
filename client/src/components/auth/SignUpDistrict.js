import React, { useState } from 'react';
import styled from 'styled-components';
import DropDown from '../../assets/icons/DropDown.svg';
import UpIcon from '../../assets/icons/UpIcon.svg';

const SignUpDistrict = ({ options, selectedOption, setSelectedOption }) => {
  const [isOpen, setIsOpen] = useState(false);
  const defaultText = '서울특별시';

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const clickDropDown = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <DropdownContainer>
      <Label>기본 위치 설정</Label>
      <DropdownBox onClick={toggleDropdown}>
        <TextContainer>{selectedOption || defaultText}</TextContainer>
        <IconContainer>
          {isOpen ? (
            <img src={UpIcon} alt='UpIcon' />
          ) : (
            <img src={DropDown} alt='DropDown' />
          )}
        </IconContainer>
      </DropdownBox>
      {isOpen && (
        <DropdownList>
          {options.map((option, index) => (
            <DropdownItem key={index} onClick={() => clickDropDown(option)}>
              {option}
            </DropdownItem>
          ))}
        </DropdownList>
      )}
    </DropdownContainer>
  );
};

export default SignUpDistrict;

const DropdownContainer = styled.div`
  position: relative;
  width: 9rem;
  margin-top: -6px;
`;

const Label = styled.p`
  font-size: 0.9rem;
  color: #191619;
  margin-bottom: 3px;
`;

const DropdownBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 8.5rem;
  height: 1.35rem;
  color: #191619;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  padding: 8px 5px 8px 20px;
  border: 1px solid #d0d0d0;
  cursor: pointer;

  img {
    margin: 0px 0px 1px 15px;
  }
`;

const TextContainer = styled.div`
  flex: 1;
  text-align: center;
  font-size: 0.9rem;
`;

const IconContainer = styled.div`
  margin-right: 20px;
`;

const DropdownList = styled.ul`
  position: absolute;
  border-radius: 5px;
  width: 10rem;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 150px;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  border: 1px solid #d0d0d0;
  background-color: white;
  z-index: 1000;
`;

const DropdownItem = styled.li`
  padding: 6px;
  font-size: 0.9rem;
  color: #191619;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;

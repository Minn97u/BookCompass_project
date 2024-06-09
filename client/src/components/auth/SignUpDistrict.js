import React, { useState } from 'react';
import styled from 'styled-components';
import DropDown from '../../assets/icons/DropDown.svg';
import UpIcon from '../../assets/icons/UpIcon.svg';

const SignUpDistrict = ({ options, location }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [defaultText, setDefaultTExt] = useState(location);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const clickDropDown = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <DropdownContainer>
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
  width: 11rem;
  margin-top: -2px;
`;

const DropdownBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 9.5rem;
  height: 1.3rem;
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
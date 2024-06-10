import React from 'react';
import styled from 'styled-components';
import LocationPing from '../../assets/icons/LocationPing.svg';
import DeleteIcon from '../../assets/icons/DeleteIcon.svg';

const BookMarkList = ({ title, location }) => {
  return (
    <ListContainer>
      <List>
        <EleBox>
          <LocationIconImg src={LocationPing} alt='location-icon' />
          <TextBox>
            <Title>{title}</Title>
            <Location>{location}</Location>
          </TextBox>
        </EleBox>
        <CancelBookMark>
          <DeleteIconImg src={DeleteIcon} alt='minus-icon' />
        </CancelBookMark>
      </List>
    </ListContainer>
  );
};

export default BookMarkList;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const List = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const EleBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const LocationIconImg = styled.img`
  width: 2rem;
  margin-right: 10px;
`;

const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
`;

const Title = styled.span`
  font-size: 1.2rem;
  color: #191619;
  padding-bottom: 2px;
`;

const Location = styled.span`
  font-size: 0.9;
  color: #868686;
`;

const CancelBookMark = styled.button`
  border: none;
  background-color: transparent;
  cursor: pointer;
`;

const DeleteIconImg = styled.img`
  width: 1.2rem;
  cursor: pointer;
`;

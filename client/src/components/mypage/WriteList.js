import React from 'react';
import styled from 'styled-components';
import DeleteIcon from '../../assets/icons/DeleteIcon.svg';

const WriteList = ({ title, date }) => {
  return (
    <ListContainer>
      <List>
        <TextBox>
          <Title>{title}</Title>
          <Date>{date}</Date>
        </TextBox>
        <DeleteWrite>
          <DeleteIconImg src={DeleteIcon} alt='delete-icon' />
        </DeleteWrite>
      </List>
    </ListContainer>
  );
};

export default WriteList;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const List = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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

const Date = styled.span`
  font-size: 0.9;
  color: #868686;
`;

const DeleteWrite = styled.button`
  border: none;
  background-color: transparent;
`;

const DeleteIconImg = styled.img`
  width: 1.2rem;
  cursor: pointer;
`;

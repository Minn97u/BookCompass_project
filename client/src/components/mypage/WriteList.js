import React, { useState } from 'react';
import styled from 'styled-components';
import DeleteIcon from '../../assets/icons/DeleteIcon.svg';
import DeleteModal from '../common/DeleteModal';

const WriteList = ({ datas }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleDeleteBtn = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <ListContainer>
        {datas.map((data, index) => (
          <ListGroup key={index}>
            <List>
              <TextBox>
                <Title>{data.title}</Title>
                <Date>{data.date}</Date>
              </TextBox>
              <DeleteWrite>
                <DeleteIconImg
                  src={DeleteIcon}
                  alt='delete-icon'
                  onClick={handleDeleteBtn}
                />
              </DeleteWrite>
            </List>
            {datas.length > 1 && index !== datas.length - 1 && <Hr />}
          </ListGroup>
        ))}
      </ListContainer>
      {modalOpen && <DeleteModal onClose={closeModal} />}
    </>
  );
};

export default WriteList;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ListGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const List = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 7px 0px;
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

const Hr = styled.hr`
  border: none;
  border-top: 1px solid #ededed;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
`;

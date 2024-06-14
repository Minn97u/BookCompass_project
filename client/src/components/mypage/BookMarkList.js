import React, { useState } from 'react';
import styled from 'styled-components';
import LocationPing from '../../assets/icons/LocationPing.svg';
import DeleteIcon from '../../assets/icons/DeleteIcon.svg';
import DeleteModal from '../common/DeleteModal';

const BookMarkList = ({ datas }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const closeModal = () => {
    setModalOpen(false);
    setCurrentId(null);
  };

  const handleDeleteBtn = () => {
    setModalOpen(true);
  };

  return (
    <>
      <ListContainer>
        {datas.map((data, index) => (
          <ListGroup key={index}>
            <List>
              <EleBox>
                <LocationIconImg src={LocationPing} alt='location-icon' />
                <TextBox>
                  <Title>{data.name}</Title>
                  <Location>{data.location}</Location>
                </TextBox>
              </EleBox>
              <CancelBookMark>
                <DeleteIconImg
                  src={DeleteIcon}
                  alt='minus-icon'
                  onClick={handleDeleteBtn}
                />
              </CancelBookMark>
            </List>
            {datas.length > 1 && index !== datas.length - 1 && <Hr />}
          </ListGroup>
        ))}
      </ListContainer>
      {modalOpen && <DeleteModal onClose={closeModal} />}
    </>
  );
};

export default BookMarkList;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
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

const Hr = styled.hr`
  border: none;
  border-top: 1px solid #ededed;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
`;

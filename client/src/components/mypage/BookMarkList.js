import React, { useState } from 'react';
import styled from 'styled-components';
import LocationPing from '../../assets/icons/LocationPing.svg';
import DeleteIcon from '../../assets/icons/DeleteIcon.svg';
import GreenMarker from '../../assets/icons/GreenMarker.svg';
import DeleteModal from '../common/DeleteModal';

const BookMarkList = ({ datas, setList }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [currentType, setCurrentType] = useState(null);

  const closeModal = () => {
    setModalOpen(false);
    setCurrentId(null);
    setCurrentType(null);
  };

  const handleDeleteBtn = (listid, type) => {
    console.log('리스트 아이디', listid);
    setCurrentId(listid);
    setCurrentType(type);
    setModalOpen(true);
  };

  const handleDeleteConfirm = (id) => {
    console.log(id);
    setList(datas.filter((data) => data.id !== id));
    closeModal();
  };

  return (
    <>
      <ListContainer>
        {datas.map((data, index) => (
          <ListGroup key={data.id}>
            <List>
              <EleBox>
                <LocationIconImg
                  src={data.type === 'library' ? LocationPing : GreenMarker}
                  alt='location-icon'
                />
                <TextBox>
                  <Title>{data.name}</Title>
                  <Location>{data.address}</Location>
                </TextBox>
              </EleBox>
              <CancelBookMark>
                <DeleteIconImg
                  src={DeleteIcon}
                  alt='minus-icon'
                  onClick={() => handleDeleteBtn(data.id, data.type)}
                />
              </CancelBookMark>
            </List>
            {datas.length > 1 && index !== datas.length - 1 && <Hr />}
          </ListGroup>
        ))}
      </ListContainer>
      {modalOpen && (
        <DeleteModal
          onClose={closeModal}
          id={currentId}
          type={currentType}
          deleteSuccess={handleDeleteConfirm}
        />
      )}
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
  font-size: 0.9rem;
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

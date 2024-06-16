import React, { useState } from 'react';
import { navigate, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import DeleteIcon from '../../assets/icons/DeleteIcon.svg';
import DeleteModal from '../common/DeleteModal';

const WriteList = ({ datas, type, setList }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const navigate = useNavigate();

  const closeModal = () => {
    setModalOpen(false);
    setCurrentId(null);
  };

  const handleDeleteBtn = (listid) => {
    console.log('리스트 아이디', listid);
    setCurrentId(listid);
    setModalOpen(true);
  };

  const handleDeleteConfirm = (id) => {
    console.log(id);
    setList(datas.filter((data) => data.id !== id));
    closeModal();
  };

  const handleTitleClick = (id) => {
    console.log('Title clicked for id:', id);
    navigate(`/board/${id}`);
  };

  return (
    <>
      <ListContainer>
        {datas.map((data, index) => (
          <ListGroup key={data.id}>
            <List>
              <TextBox>
                <Title onClick={() => handleTitleClick(data.id)}>
                  {data.title}
                </Title>
                <Date>{data.date}</Date>
              </TextBox>
              <DeleteWrite>
                <DeleteIconImg
                  src={DeleteIcon}
                  alt='delete-icon'
                  onClick={() => handleDeleteBtn(data.id)}
                />
              </DeleteWrite>
            </List>
            {datas.length > 1 && index !== datas.length - 1 && <Hr />}
          </ListGroup>
        ))}
      </ListContainer>
      {modalOpen && (
        <DeleteModal
          onClose={closeModal}
          id={currentId}
          type={type}
          deleteSuccess={handleDeleteConfirm}
        />
      )}
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
  padding-bottom: 4px;
  cursor: pointer;
`;

const Date = styled.span`
  font-size: 0.8rem;
  color: #afafaf;
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

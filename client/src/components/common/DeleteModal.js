import React from 'react';
import styled from 'styled-components';
import closebutton from '../../assets/icons/closebutton.svg';
import {
  deleteMyPost,
  deleteMyComments,
  deleteMyReviews,
  deleteMyFavorite
} from '../../api/Mypage';

const DeleteType = {
  POST: 'post',
  COMMENT: 'comment',
  LIBRARY: 'library',
  PARK: 'park',
  REVIEW: 'review'
};

const DeleteModal = ({ onClose, id, type, deleteSuccess }) => {
  const handleDeleteBtn = async () => {
    try {
      if (type === DeleteType.POST) {
        await deleteMyPost(id);
      } else if (type === DeleteType.COMMENT) {
        await deleteMyComments(id);
      } else if (type === DeleteType.LIBRARY || type === DeleteType.PARK) {
        await deleteMyFavorite({ id, type: type.toLowerCase() });
      } else if (type === DeleteType.REVIEW) {
        await deleteMyReviews(id);
      }
      deleteSuccess(id);
      onClose();
    } catch (error) {
      console.error('삭제 실패:', error);
    }
  };

  return (
    <>
      <ModalBack onClick={onClose}>
        <ModalContainer onClick={(e) => e.stopPropagation()}>
          <Modal>
            <CloseBtn src={closebutton} alt='close-btn' onClick={onClose} />
            <Container>
              <Title>정말 삭제하시겠습니까?</Title>
              <DeleteBtn onClick={handleDeleteBtn}>삭제</DeleteBtn>
            </Container>
          </Modal>
        </ModalContainer>
      </ModalBack>
    </>
  );
};

export default DeleteModal;

const ModalBack = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 998;
`;

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 999;
  position: fixed;
  top: 50%;
  left: 58%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 8px;
`;

const Modal = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #ececec;
  border-radius: 8px;
  box-shadow: 0px 3px 18px rgba(0, 0, 0, 0.1);
  width: 18rem;
  padding: 70px 30px 50px 30px;
  position: relative;
`;

const CloseBtn = styled.img`
  width: 0.8rem;
  position: absolute;
  top: 22px;
  right: 22px;
  cursor: pointer;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
`;

const Title = styled.div`
  font-size: 1.3rem;
  font-weight: 600;
  color: #191619;
  margin-bottom: 30px;
`;

const DeleteBtn = styled.button`
  font-size: 1rem;
  font-weight: 400;
  color: #191619;
  width: 6rem;
  padding: 7px 10px 7px 10px;
  border: none;
  border-radius: 10px;
  background-color: #e7e7e7;
  cursor: pointer;

  &:hover {
    background-color: #e64343;
    color: white;
  }
`;

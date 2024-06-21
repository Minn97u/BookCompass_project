import React from 'react';
import styled from 'styled-components';
import CustomModal from './Modal';

const DeleteConfirmModal = ({
  isOpen,
  onRequestClose,
  onConfirm,
  isSubmitting
}) => (
  <CustomModal isOpen={isOpen} onRequestClose={onRequestClose}>
    <DeleteConfirmContainer>
      <h2>정말 삭제하시겠습니까?</h2>
      <CommentButton onClick={onConfirm} disabled={isSubmitting}>
        예
      </CommentButton>
      <CommentButton onClick={onRequestClose}>아니오</CommentButton>
    </DeleteConfirmContainer>
  </CustomModal>
);

const DeleteConfirmContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  padding-top: 10rem;
  p {
    margin-bottom: 1rem;
  }
  button {
    margin: 0.5rem;
    color: gray;
    cursor: pointer;
    font-size: 0.875rem;
    background: none;
    border: none;
    &:hover {
      color: black;
    }
  }
`;

const CommentButton = styled.button`
  margin-left: auto;
  display: block;
  background-color: #543d20;
  color: white;
  padding: 0.4rem 0.9rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.875rem;
`;

export default DeleteConfirmModal;

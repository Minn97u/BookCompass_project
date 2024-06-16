import React from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import { ReactComponent as CloseIcon } from '../../assets/icons/closebutton.svg';

const CustomModal = ({ isOpen, onRequestClose, children }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel='Item Detail Modal'
      ariaHideApp={false}
      style={customModalStyles}
    >
      <CloseButton onClick={onRequestClose}>
        <CloseIcon />
      </CloseButton>
      {children}
    </Modal>
  );
};

const CloseButton = styled.button`
  background: none;
  border: none;
  position: absolute;
  top: 0.25rem;
  right: 0rem;
  padding-bottom: 2rem;
  margin: 15px;
  cursor: pointer;
`;

const customModalStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '94%',
    maxWidth: '60rem',
    height: '35rem',
    maxHeight: '85vh',
    overflowY: 'auto',
    borderRadius: '1rem',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
  }
};

export default CustomModal;

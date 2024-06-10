import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import closebutton from '../../assets/icons/closebutton.svg';

const AuthModal = ({ title, component, onClose }) => {
  const [modalOpen, setModalOpen] = useState(true);
  const modalElement = document.getElementById('modal');

  const handleOverlayClick = () => {
    // 클릭 이벤트 무시
  };

  return (
    <>
      {modalOpen &&
        ReactDOM.createPortal(
          <ModalOverlay onClick={handleOverlayClick}>
            <ModalContainer>
              <Modal>
                <CloseBtn src={closebutton} alt='close-btn' onClick={onClose} />
                <Container>
                  <Title>{title}</Title>
                  <ContentWrapper>{component}</ContentWrapper>
                </Container>
              </Modal>
            </ModalContainer>
          </ModalOverlay>,
          modalElement
        )}
    </>
  );
};

export default AuthModal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
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
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
`;

const Modal = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #ececec;
  border-radius: 8px;
  box-shadow: 0px 3px 18px rgba(0, 0, 0, 0.06);
  width: 38rem;
  padding: 70px 30px;
  position: relative;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  max-height: 100%;
  &::-webkit-scrollbar {
    display: none;
  }
  margin-top: 20px;
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
  overflow: auto;
`;

const Title = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
  color: #191619;
`;

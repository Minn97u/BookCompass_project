import React from 'react';
import styled from 'styled-components';

const MypageBox = ({ icon, title, component, mapIcon }) => {
  return (
    <Container>
      <TitleBox>
        <Icon src={icon} alt='icon' />
        <Title>{title}</Title>
      </TitleBox>
      <ContentWrapper>{component}</ContentWrapper>
      {mapIcon && (
        <MapBtn>
          <img src={mapIcon} alt='map-icon' />
        </MapBtn>
      )}
    </Container>
  );
};

export default MypageBox;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 8px solid #efefef;
  border-radius: 5px;
  box-shadow: 0px 3px 18px rgba(0, 0, 0, 0.04);
  width: 39rem;
  height: 24rem;
  padding: 20px 50px 33px 50px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
`;

const TitleBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`;

const ContentWrapper = styled.div`
  overflow-y: auto;
  max-height: 100%;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Icon = styled.img`
  padding-right: 10px;
`;

const Title = styled.p`
  font-size: 1.25rem;
  font-weight: 500;
  color: #191619;
`;

const MapBtn = styled.button`
  border: none;
  background-color: transparent;
  cursor: pointer;
  position: absolute;
  left: 45%;
  bottom: 15px;
`;

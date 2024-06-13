import React from 'react';
import styled from 'styled-components';
import ClickStar from './ClickStar';

function ModalReviewWriteContainer() {
  return (
    <>
      <ReviewWriteContainer>
        <Header>
          <ClickStar />
          <Button>등록</Button>
        </Header>
        <ReviewInput>
          <input type='text' placeholder='리뷰를 작성해주세요' />
        </ReviewInput>
      </ReviewWriteContainer>
    </>
  );
}

export default ModalReviewWriteContainer;

const ReviewWriteContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  padding: 10px 0;
  width: 100%; /* 컨테이너의 가로를 100%로 설정 */
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const ReviewInput = styled.div`
  width: 100%; /* 부모 컨테이너의 가로를 100%로 설정 */
  padding: 10px 0;

  & > input {
    width: 100%; /* input 태그의 가로를 100%로 설정 */
    height: 102px; /* input 태그의 높이를 102px로 설정 */
    padding: 8px;
    font-size: 14px;
    border: 1px solid #dadada;
    border-radius: 5px;
    box-sizing: border-box;
  }
`;

const Button = styled.button`
  background: #563c0a;
  border-radius: 7px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 10px;
  line-height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #ffffff;
  padding: 5px 10px; /* 패딩을 추가하여 버튼의 크기를 조정 */
  border: none; /* 기본 브라우저 스타일 제거 */
  cursor: pointer; /* 커서 모양 변경 */
  transition: transform 0.2s; /* 크기 변화의 애니메이션 효과를 추가 */

  &:hover {
    transform: scale(1.1); /* hover 시 크기 증가 */
  }
`;

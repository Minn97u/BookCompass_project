import React, { useEffect } from 'react';
import styled from 'styled-components';
import { ReactComponent as BigLogo } from '../../src/assets/icons/IntroLogo.svg';
import { getUserInfo } from '../api/Auth';

function Intro() {
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await getUserInfo();
        console.log('사용자 정보:', res);
        localStorage.setItem('userId', res.data.user._id);
        localStorage.setItem('userName', res.data.user.name);
        localStorage.setItem('userRegion', res.data.user.region);
        localStorage.setItem('favoriteAuthor', res.data.user.favoriteAuthor);
      } catch (error) {
        console.error('사용자 정보 가져오기 실패:', error);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div>
      <Container>
        <StyledBigLogo />
      </Container>
      <StyledLeftDiv>
        <TextWithMargin>당신의 이야기가 시작되는 곳,</TextWithMargin>
        <TextWithMargin>서재나침반</TextWithMargin>
      </StyledLeftDiv>
      <StyledRightDiv>
        <TextWithMargin>당신의 서재를 찾아보세요</TextWithMargin>
      </StyledRightDiv>
    </div>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center; /* 가로 중앙 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
  height: 100vh; /* 화면 전체 높이를 차지하도록 설정 */
`;

const StyledBigLogo = styled(BigLogo)`
  width: 638px;
  height: 290.62px;
`;

const StyledLeftDiv = styled.div`
  /* Rectangle 290 */
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;

  position: absolute;
  width: 50%;
  height: 388px;
  left: 0px;
  top: 800px;

  background: rgba(215, 184, 144, 0.7);

  /* 당신의 이야기가 시작되는 곳, 서재 나침반 */

  font-family: 'SUITE';
  font-style: normal;
  font-weight: 500;
  font-size: 36px;
  line-height: 40px;
  /* or 44% */
  text-align: right;

  color: #543d20;

  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

const StyledRightDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  position: absolute;
  width: 50%;
  height: 388px;
  right: 0px;
  top: 800px;

  background: rgba(86, 60, 10, 0.7);
  /* 당신만의 서재를 찾아보세요 */

  font-family: 'SUITE';
  font-style: normal;
  font-weight: 600;
  font-size: 36px;
  line-height: 16px;
  /* identical to box height, or 44% */
  text-align: left;

  color: #fffefc;

  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

const TextWithMargin = styled.div`
  margin: 20px;
`;

export default Intro;

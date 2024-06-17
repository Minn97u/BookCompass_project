import React from 'react';
import styled from 'styled-components';
import { ReactComponent as BigLogo } from '../../src/assets/icons/IntroLogo.svg';

function Intro() {
  return (
    <MainContainer>
      <Header>
        <StyledBigLogo />
      </Header>
      <Content>
        <StyledLeftDiv>
          <TextWithMargin>당신의 이야기가 시작되는 곳,</TextWithMargin>
          <TextWithMargin>서재나침반</TextWithMargin>
        </StyledLeftDiv>
        <StyledRightDiv>
          <TextWithMargin>당신의 서재를 찾아보세요</TextWithMargin>
        </StyledRightDiv>
      </Content>
      <DescriptionContainer>
        <DescriptionTitle>Q29 설문조사 결과</DescriptionTitle>
        <DescriptionText>
          이 파이 차트는 서울시 시민들의 도서관 이용 실태조사 결과를
          나타냅니다... 서울시 시민들은!!
        </DescriptionText>
      </DescriptionContainer>
      <GraphSection>
        <GraphsRow>
          <GraphContainer>
            <iframe
              src='/fig_q29_pie2.html'
              width='100%'
              height='500px'
              style={{ border: 'none' }}
              title='Pie Chart Q29'
            />
          </GraphContainer>
          <GraphContainer>
            <iframe
              src='/fig_q28_pie2.html'
              width='100%'
              height='500px'
              style={{ border: 'none' }}
              title='Pie Chart Q28'
            />
          </GraphContainer>
        </GraphsRow>
      </GraphSection>
      <GraphSection>
        <GraphContainer>
          <iframe
            src='/seoul_districts_visitors.html'
            width='100%'
            height='500px'
            style={{ border: 'none' }}
            title='Seoul Districts Visitors'
          />
        </GraphContainer>
        <DescriptionContainer>
          <DescriptionTitle>
            서울시 시민들의 공공 도서관 방문 횟수는?
          </DescriptionTitle>
          <DescriptionText>
            이 그래프는 서울 각 구별 방문자 수를 나타냅니다... 코로나 19 이후로
            회복세 이지만 아직 그 이전의 수치만큼 회복하진 못했습니당.
          </DescriptionText>
        </DescriptionContainer>
      </GraphSection>
    </MainContainer>
  );
}

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
`;

const StyledBigLogo = styled(BigLogo)`
  width: 638px;
  height: 290.62px;
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 20px;
`;

const StyledLeftDiv = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  background: rgba(215, 184, 144, 0.7);
  padding: 20px;

  font-family: 'SUITE';
  font-style: normal;
  font-weight: 500;
  font-size: 36px;
  line-height: 40px;
  text-align: right;
  color: #543d20;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

const StyledRightDiv = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  background: rgba(86, 60, 10, 0.7);
  padding: 20px;

  font-family: 'SUITE';
  font-style: normal;
  font-weight: 600;
  font-size: 36px;
  line-height: 40px;
  text-align: left;
  color: #fffefc;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

const TextWithMargin = styled.div`
  margin: 20px;
`;

const GraphSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 50px;
`;

const GraphsRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const GraphContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
`;

const DescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
`;

const DescriptionTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
`;

const DescriptionText = styled.p`
  font-size: 16px;
`;

export default Intro;

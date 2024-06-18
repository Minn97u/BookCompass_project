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
      <GraphSection>
        <DescriptionContainer>
          <DescriptionTitle>연령대별 독서 통계</DescriptionTitle>
          <DescriptionText>
            지난 10년 동안 서울시의 독서인구 비율은 2013년{' '}
            <strong>62.4%</strong>에서 2023년 <strong>48.5%</strong>로 꾸준히{' '}
            <strong>감소</strong> 해왔습니다.
            <br />
            <br /> 또한, 지난 1년 동안 독서 인구 1인당 평균 독서 권수는{' '}
            <strong>14.8권</strong>으로, 2년 전에 비해{' '}
            <strong>0.4권 감소</strong>한 상황입니다. <br />
            <br />
            이러한 추세는 현대 사회에서 <strong>독서의 중요성</strong>이 점점 더
            간과되고 있음을 보여줍니다.
          </DescriptionText>
        </DescriptionContainer>
      </GraphSection>
      <GraphSection>
        <GraphsRow>
          <GraphContainer>
            <iframe
              src='/books_per_person_by_age.html'
              width='100%'
              height='500px'
              style={{ border: 'none' }}
              title='연령대별 1인당 평균 독서 권수'
            />
          </GraphContainer>
          <GraphContainer>
            <iframe
              src='/reading_population_by_age.html'
              width='100%'
              height='500px'
              style={{ border: 'none' }}
              title='연령대별 평균 독서 인구 비율'
            />
          </GraphContainer>
        </GraphsRow>
      </GraphSection>
      <DescriptionContainer>
        <DescriptionTitle>서울시 독서문화 실태 조사 결과</DescriptionTitle>
        <DescriptionText>
          서울시민들의 도서관 이용 실태 조사를 바탕으로, 우리는 도서관이
          제공해야 할 <strong>다양한 정보</strong>와 <strong>프로그램</strong>,
          그리고 <strong>접근성</strong>의 중요성을 확인할 수 있었습니다. <br />
          <br />
          이러한 요구를 반영하여, 우리 웹 프로젝트는{' '}
          <strong>서울시 도서관</strong> 및 <strong>독서 커뮤니티 정보</strong>
          를 쉽게 접근할 수 있도록 하며, 시민들이 필요한 정보를 빠르게 찾고{' '}
          <strong>다양한 독서 활동</strong>에 참여할 수 있도록 지원하고자
          합니다.
          <br />
          <br /> 이를 통해 <strong>독서 문화</strong>를 더욱 활성화하고,
          도서관의 <strong>이용률</strong>을 높이는 것이 목표입니다!.
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
      <DescriptionContainer>
        <DescriptionTitle>
          서울시 시민들의 공공 도서관 방문 횟수는?
        </DescriptionTitle>
        <DescriptionText>
          <br />
          그래프에서 보듯이 2018년부터 2022년까지 서울시 각 구의 도서관 방문자
          수는 <strong>코로나19 팬데믹의 영향</strong>으로 2020년에 급격히
          감소하였으며, 이후 점차 회복세를 보이고 있지만 아직 팬데믹 이전
          수준으로 완전히 회복되지 않았습니다.
          <br />
          <br />
          특히, <strong>가까운 거리에 있는 도서관의 중요성</strong>과{' '}
          <strong>편리한 접근성</strong>을 고려한 시민들의 요구를 반영하여, 우리
          웹 프로젝트는 도서관 정보를 쉽게 접근할 수 있게 제공하고, 다양한 독서
          활동과 커뮤니티 참여를 장려합니다.
          <br />
          <br />
          이를 통해 <strong>도서관 이용률</strong>을 높이고,{' '}
          <strong>독서 문화를 더욱 활성화</strong>하는 것을 목표로 하고
          있습니다.
        </DescriptionText>
      </DescriptionContainer>
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

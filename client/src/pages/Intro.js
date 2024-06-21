import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { TextPlugin, ScrollTrigger } from 'gsap/all';
import styled from 'styled-components';
import Logo from '../assets/icons/Logo.svg';
import BookImg from '../assets/icons/bookImg.svg';
import { getUserInfo } from '../api/Auth';
import IntroImage from '../assets/icons/IntroImg.svg';

gsap.registerPlugin(ScrollTrigger);

function Intro() {
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await getUserInfo();
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

  const subContainerRef = useRef(null);
  const subContainer2Ref = useRef(null);
  const subContainer3Ref = useRef(null);
  const subContainer4Ref = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      subContainerRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: subContainerRef.current,
          start: 'top 80%'
        }
      }
    );

    gsap.fromTo(
      subContainer2Ref.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: subContainer2Ref.current,
          start: 'top 80%'
        }
      }
    );

    gsap.fromTo(
      subContainer3Ref.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: subContainer3Ref.current,
          start: 'top 80%'
        }
      }
    );

    gsap.fromTo(
      subContainer4Ref.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: subContainer4Ref.current,
          start: 'top 80%'
        }
      }
    );
  }, []);

  return (
    <MainContainer>
      <TitleContainer>
        <TitleBox>
          <Title>
            우리 동네 도서관 정보 서비스, <span> 서재 나침반</span>
          </Title>
          <SubTitle>
            도서관과 독서 공간을 쉽고 편리하게 찾고 싶으신가요?
            <br />
            우리 동네 책 읽기 좋은 공간, 지금 바로 찾아보세요!
          </SubTitle>
          <IntroImg src={IntroImage} alt='intro-img' />
        </TitleBox>
      </TitleContainer>
      <SubContainer>
        <SubBox1 ref={subContainerRef}>
          <DescriptionTitle>우리는 책을 얼마나 읽을까요?</DescriptionTitle>
          <DescriptionContainer>
            <DescriptionText>
              지난 10년 동안 서울시의 독서인구 비율은 2013년{' '}
              <strong>62.4%</strong>에서 2023년 <strong>48.5%</strong>로 꾸준히{' '}
              <strong>감소</strong>해왔습니다.
              <br />
              <br /> 또한, 지난 1년 동안 독서 인구 1인당 평균 독서 권수는{' '}
              <strong>14.8권</strong>으로, 2년 전에 비해{' '}
              <strong>0.4권 감소</strong>한 상황입니다. <br />
              <br />
              이러한 추세는 현대 사회에서 <strong>독서의 중요성</strong>이 점점
              더 간과되고 있음을 보여줍니다.
            </DescriptionText>
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
          </DescriptionContainer>
        </SubBox1>
      </SubContainer>
      <Title2 ref={subContainer2Ref}>
        <DescriptionTitle>서울시 독서문화 실태 조사 결과는?</DescriptionTitle>
        <DescriptionContainer>
          <DescriptionText2>
            <br />
            서울시민들의 도서관 이용 실태 조사를 바탕으로 도서관이 제공해야 할{' '}
            <strong>다양한 정보</strong>와 <strong>프로그램</strong>, 그리고{' '}
            <strong>접근성</strong>의 중요성을 확인할 수 있었습니다.
            <br />
          </DescriptionText2>

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
        </DescriptionContainer>
      </Title2>
      <SubContainer>
        <DescriptionContainer2 ref={subContainer3Ref}>
          <DescriptionTitle>
            서울시 시민들의 공공 도서관 방문 횟수는?
          </DescriptionTitle>
          <DescriptionText>
            <br />
            2018년부터 2022년까지 서울시 각 구의 도서관 방문자 수는{' '}
            <strong>코로나19 팬데믹의 영향</strong>으로 2020년에 급격히
            감소하였으며, <br />
            <br /> 이후 점차 회복세를 보이고 있지만 아직 팬데믹 이전 수준으로
            완전히 회복되지 않았습니다.
            <br />
          </DescriptionText>

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
        </DescriptionContainer2>
      </SubContainer>
      <BottomBox ref={subContainer4Ref}>
        <Title>
          <span>서재 나침반</span>은,
        </Title>
        <DescriptionText4>
          이러한 문제를 해결하고 <strong>독서 문화를 활성화</strong>하기 위해
          만들어졌습니다.
          <br />
          <br /> 시민들이 <strong>도서관 정보를 쉽게</strong> 접근 할 수 있도록
          하며, <strong>다양한 독서 활동과 커뮤니티 환경</strong>을 제공합니다.
          <br />
          <br />
          이를 통해 <strong>도서관 이용률</strong>을 높이고, 시민들이 더 많은
          책을 읽을 수 있도록 돕는 것을 <strong>목표</strong>로 합니다.
          <br />
          <br />
        </DescriptionText4>
      </BottomBox>
      <Footer>ⓒ BookCompass All rights reserved</Footer>
    </MainContainer>
  );
}

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 120px 0px;
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30vh;
`;

const IntroImg = styled.img`
  width: 30rem;
  align-self: center;
  margin-right: 7px;
`;

const TitleBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled.p`
  display: flex;
  flex-direction: row;
  font-size: 2.8rem;
  color: #242424;
  font-family: 'MBC1961GulimM';

  span {
    color: #543824;
    padding-left: 10px;
  }
`;

const SubTitle = styled.p`
  font-size: 1.3rem;
  font-family: 'S-CoreDream-4Regular';
  line-height: 30px;
  margin-top: -20px;
`;

const SubContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  background-color: #f5e9da;
  padding: 80px 0px 115px 0px;
`;

const Title2 = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 70px 0px;
`;

const GraphSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 25px;
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
`;

const DescriptionTitle = styled.p`
  font-family: 'MBC1961GulimM';
  font-size: 2.5rem;
  margin-bottom: 25px;
`;

const DescriptionText = styled.p`
  font-size: 19px;
  font-family: 'S-CoreDream-4Regular';
  line-height: 18px;
`;

const DescriptionContainer2 = styled.div`
  width: 100%;
  margin-top: 6px;
  margin-top: 40px;
`;

const DescriptionText2 = styled.p`
  font-size: 19px;
  margin-top: -5px;
  font-size: 19px;
  font-family: 'S-CoreDream-4Regular';
  line-height: 18px;
`;

const DescriptionText4 = styled.div`
  font-size: 19px;
  line-height: 19px;
  margin-top: -10px;
  font-family: 'S-CoreDream-4Regular';
`;

const BottomBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 80px;
  width: 100%;
  padding: 90px 0px 70px 0px;
`;

const SubBox1 = styled.div`
  display: flex;
  flex-direction: column;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  font-family: 'S-CoreDream-4Regular';
  color: #c2c2c2;
  padding: 30px 0px;
  width: 100%;
  box-shadow: 0 -1px 5px rgba(189, 189, 189, 0.25);
`;

export default Intro;

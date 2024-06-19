import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { TextPlugin, ScrollTrigger } from 'gsap/all';
import styled from 'styled-components';
import Logo from '../assets/icons/Logo.svg';
import BookImg from '../assets/icons/bookImg.svg';

gsap.registerPlugin(TextPlugin, ScrollTrigger);
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

  const app = useRef(null);
  const bookImgRef = useRef(null);
  const titleRef = useRef(null);
  const textRef = useRef(null);
  const graphSectionRef = useRef(null);
  const title2Ref = useRef(null);
  const text2Ref = useRef(null);
  const graphSection2Ref = useRef(null);
  const title3Ref = useRef(null);
  const text3Ref = useRef(null);
  const graphSection3Ref = useRef(null);
  const title4Ref = useRef(null);
  const text4Ref = useRef(null);
  const logoImgRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      defaults: { duration: 0.5, ease: 'power1.out' }
    });

    // BookImg 애니메이션
    tl.fromTo(
      bookImgRef.current,
      { y: 70, opacity: 0 },
      { y: 0, opacity: 1, ease: 'power3.out' }
    );

    // 제목1 타이핑 애니메이션
    tl.to(titleRef.current, {
      duration: 3, // 타이핑 속도
      text: { value: '연령대별 독서 통계', speed: 0.5, stagger: 0.1 },
      ease: 'none',
      delay: 0.5
    });

    // 설명1 텍스트 페이드 인 애니메이션
    tl.fromTo(
      textRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1 },
      '-=0.5'
    );

    // 그래픽1 섹션 애니메이션
    tl.fromTo(
      graphSectionRef.current,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      '-=1' // 앞의 애니메이션들이 끝난 후 시작
    );

    // 제목2 타이핑 애니메이션
    gsap.to(title2Ref.current, {
      duration: 2,
      text: {
        value: '서울시 독서문화 실태 조사 결과',
        speed: 0.5,
        stagger: 0.1
      },
      ease: 'none',
      scrollTrigger: {
        trigger: title2Ref.current,
        start: 'top center',
        toggleActions: 'play none none none'
      },
      onComplete: () => {
        // 제목2 애니메이션이 완료된 후 실행
        gsap.fromTo(
          text2Ref.current,
          { opacity: 0 },
          { opacity: 1, duration: 1 }
        );

        // 그래픽2 섹션 애니메이션
        gsap.fromTo(
          graphSection2Ref.current,
          { y: 100, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          '-=1' // 앞의 애니메이션들이 끝난 후 시작
        );
      }
    });

    // 제목3 타이핑 애니메이션
    gsap.to(title3Ref.current, {
      duration: 2,
      text: {
        value: '서울시 시민들의 공공 도서관 방문 횟수는?',
        speed: 0.5,
        stagger: 0.1
      },
      ease: 'none',
      scrollTrigger: {
        trigger: title3Ref.current,
        start: 'top center',
        toggleActions: 'play none none none'
      },
      onComplete: () => {
        // 제목3 애니메이션이 완료된 후 실행
        gsap.fromTo(
          text3Ref.current,
          { opacity: 0 },
          { opacity: 1, duration: 1 }
        );

        // 그래픽3 섹션 애니메이션
        gsap.fromTo(
          graphSection3Ref.current,
          { y: 100, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          '-=1' // 앞의 애니메이션들이 끝난 후 시작
        );
      }
    });

    // 제목4 타이핑 애니메이션
    gsap.to(title4Ref.current, {
      duration: 2,
      text: {
        value: '서재 나침반의 기획 의도',
        speed: 0.5,
        stagger: 0.1
      },
      ease: 'none',
      scrollTrigger: {
        trigger: title4Ref.current,
        start: 'top center',
        toggleActions: 'play none none none'
      },
      onComplete: () => {
        // 제목3 애니메이션이 완료된 후 실행
        gsap.fromTo(
          text4Ref.current,
          { opacity: 0 },
          { opacity: 1, duration: 1 }
        );
      }
    });

    // logoImg 애니메이션
    gsap.fromTo(
      logoImgRef.current,
      { y: 70, opacity: 0, ease: 'power3.out' },
      {
        y: 0,
        opacity: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: logoImgRef.current,
          start: 'top center',
          toggleActions: 'play none none none'
        }
      }
    );

    tl.play();
  }, []);

  return (
    <MainContainer ref={app}>
      <Header>
        <BookImgContainer ref={bookImgRef} src={BookImg} alt='book' />
      </Header>
      <Title>
        <DescriptionContainer>
          <DescriptionTitle ref={titleRef}></DescriptionTitle>
          <DescriptionText ref={textRef}>
            지난 10년 동안 서울시의 독서인구 비율은 2013년{' '}
            <strong>62.4%</strong> 에서 2023년 <strong>48.5%</strong>로 꾸준히{' '}
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
      </Title>
      <GraphSection ref={graphSectionRef}>
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
      <DescriptionContainer2>
        <DescriptionTitle ref={title2Ref}></DescriptionTitle>
        <DescriptionText2 ref={text2Ref} style={{ opacity: 0 }}>
          <br />
          서울시민들의 도서관 이용 실태 조사를 바탕으로, 우리는 도서관이
          제공해야 할 <strong>다양한 정보</strong>와 <strong>프로그램</strong>,
          그리고 <strong>접근성</strong>의 중요성을 확인할 수 있었습니다.
          <br />
        </DescriptionText2>
      </DescriptionContainer2>
      <GraphSection ref={graphSection2Ref} style={{ opacity: 0 }}>
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
      <DescriptionContainer2>
        <DescriptionTitle ref={title3Ref}></DescriptionTitle>
        <DescriptionText ref={text3Ref} style={{ opacity: 0 }}>
          <br />
          2018년부터 2022년까지 서울시 각 구의 도서관 방문자 수는
          <strong>코로나19 팬데믹의 영향</strong>으로 2020년에 급격히
          감소하였으며, <br />
          <br /> 이후 점차 회복세를 보이고 있지만 아직 팬데믹 이전 수준으로
          완전히 회복되지 않았습니다.
          <br />
        </DescriptionText>
      </DescriptionContainer2>
      <GraphSection>
        <GraphContainer ref={graphSection3Ref} style={{ opacity: 0 }}>
          <iframe
            src='/seoul_districts_visitors.html'
            width='100%'
            height='500px'
            style={{ border: 'none' }}
            title='Seoul Districts Visitors'
          />
        </GraphContainer>
      </GraphSection>
      <DescriptionContainer2>
        <DescriptionTitle ref={title4Ref}></DescriptionTitle>
        <DescriptionText4 ref={text4Ref} style={{ opacity: 0 }}>
          서재 나침반은 이러한 문제를 해결하고
          <strong>독서 문화를 활성화</strong>하기 위해 만들어졌습니다.
          <br />
          <br /> 시민들이 <strong>도서관 정보를 쉽게</strong> 접근 할 수 있도록
          하며, <strong>다양한 독서 활동과 커뮤니티 환경</strong>을 제공합니다.
          <br />
          <br />
          이를 통해 <strong>도서관 이용률</strong>을 높이고, 시민들이 더 많은
          책을 읽을 수 있도록 돕는 것이 우리의 <strong>목표</strong>입니다.
          <br />
          <br />
        </DescriptionText4>
      </DescriptionContainer2>
      <BottomBox ref={logoImgRef}>
        <LogoImg src={Logo} alt='logo' />
        <BottomText>당신의 이야기가 시작되는 곳,</BottomText>
        <BottomText>당신의 서재를 찾아보세요.</BottomText>
      </BottomBox>
    </MainContainer>
  );
}

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 30vh;
  margin-bottom: -30px;
`;

const BookImgContainer = styled.img`
  width: 40rem;
  position: absolute;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LogoImg = styled.img`
  width: 30rem;
  margin-top: 120px;
  margin-bottom: 10px;
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: -10px;
`;

const GraphSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
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
  font-size: 29px;
  margin-bottom: 10px;
`;

const DescriptionText = styled.p`
  font-size: 19px;
`;

const DescriptionContainer2 = styled.div`
  margin-top: 80px;
`;

const DescriptionText2 = styled.p`
  font-size: 19px;
  margin-top: -5px;
`;

const DescriptionText4 = styled.div`
  font-size: 19px;
  margin-top: 40px;
`;

const BottomBox = styled.div`
  margin-bottom: 90px;
`;

const BottomText = styled.p`
  font-size: 1.3rem;
  margin-bottom: -10px;
  font-weight: 500;
  color: #543d20;
`;
export default Intro;

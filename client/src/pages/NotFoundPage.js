import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import NotFoundImg from '../assets/icons/NotFoundImg.svg';
import GoBackIcon from '../assets/icons/GoBackIcon.svg';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Container>
      <Title>404</Title>
      <SubTitle>PAGE NOT FOUND</SubTitle>
      <Img src={NotFoundImg} alt='Not-Found-Img' />
      <HomeBtn onClick={handleGoHome}>
        <Icon src={GoBackIcon} alt='Go-Home-Icon' />
        서재 나침반 바로가기
        <Hr />
      </HomeBtn>
    </Container>
  );
};

export default NotFoundPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 100px;
`;

const Title = styled.span`
  font-size: 5rem;
  font-weight: 600;
  color: #191619;
`;

const SubTitle = styled.span`
  font-size: 2rem;
  font-weight: 600;
  color: #191619;
`;

const Img = styled.img`
  width: 40rem;
  margin-top: -60px;
`;

const HomeBtn = styled.button`
  font-size: 1.5rem;
  color: #191619;
  border-style: none;
  background-color: transparent;
  margin-top: -20px;
  cursor: pointer;
`;

const Icon = styled.img`
  width: 2rem;
  margin-right: 10px;
`;

const Hr = styled.hr`
  border: 1px solid #3f3f3f;
  margin-top: 5px;
`;

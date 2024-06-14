import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { LongInput } from '../components/common/LongInput';
import { postUserInfo, getLogout, getUserInfo } from '../api/Auth';
import Districts from '../components/auth/Districts';
import SignUpDistrict from '../components/auth/SignUpDistrict';

const AddInfo = () => {
  const [favoriteAuthor, setFavoriteAuthor] = useState('');
  const [region, setRegion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = favoriteAuthor.trim() !== '' && region.trim() !== '';

  useEffect(() => {
    const handleLogout = () => {
      getLogout();
    };
    window.addEventListener('beforeunload', handleLogout);
    return () => {
      window.removeEventListener('beforeunload', handleLogout);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      window.alert('모두 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const data = {
        favoriteAuthor,
        region
      };
      const res = await postUserInfo(data);
      if (res.data.submit) {
        await getUserInfo();
        window.location.href = '/';
        window.alert('다시 로그인 해주세요');
      } else {
        alert('Failed to update user info');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error updating user info:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <EditBox>
        <Title>개인 정보 입력</Title>
        <Hr />
        <InputBox>
          <form onSubmit={handleSubmit}>
            <LongInput
              title='아이디 찾기 질문'
              type='text'
              placeholder='가장 좋아하는 작가 이름'
              value={favoriteAuthor}
              onChange={(e) => setFavoriteAuthor(e.target.value)}
              height='1.8rem'
            />
            <DistrictBox>
              <SignUpDistrict
                options={Districts}
                location='서울특별시'
                selectedOption={region}
                setSelectedOption={setRegion}
              />
            </DistrictBox>
            <Button type='submit'>{isSubmitting ? '등록중...' : '등록'}</Button>
          </form>
        </InputBox>
      </EditBox>
    </Container>
  );
};

export default AddInfo;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 90px;
`;

const EditBox = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #f1f1f1;
  border-radius: 5px;
  box-shadow: 0px 3px 18px rgba(0, 0, 0, 0.04);
  width: 45rem;
  height: 25rem;
  padding: 20px 50px 33px 50px;
  box-sizing: border-box;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 8px;
    background-color: #efefef;
  }
`;

const Title = styled.div`
  font-size: 1.5rem;
  font-weight: 500;
  margin: 25px 0px 20px 0px;
`;

const Hr = styled.hr`
  border: none;
  border-top: 1px solid #dfdfdf;
  width: 85%;
  margin-top: -2px;
`;

const InputBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 30px 0px;
`;

const Button = styled.button`
  margin-top: 45px;
  font-size: 0.9rem;
  font-weight: 400;
  color: white;
  width: 4.8rem;
  padding: 7px 10px 7px 10px;
  border: none;
  border-radius: 10px;
  background-color: #563c0a;
  align-self: flex-end;
  cursor: pointer;
`;

const DistrictBox = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
`;

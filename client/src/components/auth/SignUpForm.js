import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import SignUpDistrict from './SignUpDistrict';
import Districts from './Districts';
import GoogleIcon from '../../assets/icons/GoogleLogo.svg';
import { LongInput } from '../common/LongInput';
import { ShortInput } from '../common/ShortInput';
import { postSignup, getGoogleLogin, getUserInfo } from '../../api/Auth';

const emailRegEx =
  /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/i;
const passwordRegEx = /^.{8,}$/;
const SignUpForm = ({ setFormType, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [foundAnswer, setFoundAnswer] = useState('');
  const [name, setName] = useState('');
  const [region, setRegion] = useState('');
  const [checkEmailText, setCheckEmailText] = useState('');
  const [checkPasswordText, setCheckPasswordText] = useState('');
  const [checkPasswordReg, setCheckPasswordReg] = useState('');
  const [signupError, setSignupError] = useState('모두 입력해 주세요.');
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const validateForm = () => {
      const isValid =
        emailCheck(email) &&
        passwordRegCheck(password) &&
        password === checkPassword &&
        name.trim() !== '' &&
        region.trim() !== '' &&
        foundAnswer.trim() !== '' &&
        checkEmailText === '' &&
        checkPasswordText === '' &&
        checkPasswordReg === '';
      setIsFormValid(isValid);

      if (isValid) {
        setSignupError('');
      } else {
        setSignupError('모두 입력해 주세요.');
      }
    };

    validateForm();
  }, [
    email,
    password,
    checkPassword,
    name,
    region,
    foundAnswer,
    checkEmailText,
    checkPasswordText,
    checkPasswordReg
  ]);
  const emailCheck = (email) => {
    const isValid = emailRegEx.test(email);
    setCheckEmailText(isValid ? '' : '이메일 형식이 일치하지 않습니다.');

    return isValid;
  };

  const passwordCheck = (password, checkPassword) => {
    if (password !== checkPassword) {
      setCheckPasswordText('비밀번호가 일치하지 않습니다.');
    } else {
      setCheckPasswordText('');
    }
  };

  const passwordRegCheck = (password) => {
    const isValid = passwordRegEx.test(password);
    setCheckPasswordReg(
      isValid ? '' : '비밀번호는 최소 8자 이상으로 설정해주세요.'
    );

    return isValid;
  };

  const handleSignup = async () => {
    const data = {
      name,
      email,
      password,
      region,
      favoriteAuthor: foundAnswer
    };

    try {
      const res = await postSignup(data);
      console.log('회원가입 완료', res);
      setFormType('로그인');
    } catch (error) {
      console.error('회원가입 오류:', error);
      if (error.response && error.response.data && error.response.data.msg) {
        setSignupError(error.response.data.msg); // 서버에서 전달된 에러 메시지 설정
      } else {
        setSignupError('회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.'); // 일반적인 에러 메시지 설정
      }
    }
  };

  const handleGoogleSignup = async () => {
    try {
      getGoogleLogin();
      const res = await getUserInfo();
      console.log('구글 회원가입 성공', res);
      localStorage.setItem('userId', res.data.user.id);
      localStorage.setItem('userName', res.data.user.name);
      localStorage.setItem('userRegion', res.data.user.region);
      localStorage.setItem('favoriteAuthor', res.data.user.favoriteAuthor);
      onClose();
      window.location.href = '/';
    } catch (error) {
      console.error('구글 회원가입 실패:', error);
    }
  };

  return (
    <>
      <LongInput
        title='이메일'
        type='email'
        placeholder='이메일 입력'
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          emailCheck(e.target.value);
        }}
        checkText={checkEmailText}
        height='1.8rem'
      />
      <LongInput
        title='비밀번호'
        type='password'
        placeholder='비밀번호 입력'
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          passwordRegCheck(e.target.value);
        }}
        checkText={checkPasswordReg}
        height='1.8rem'
      />
      <LongInput
        title='비밀번호 확인'
        type='password'
        placeholder='비밀번호 입력'
        value={checkPassword}
        onChange={(e) => {
          setCheckPassword(e.target.value);
          passwordCheck(password, e.target.value);
        }}
        checkText={checkPasswordText}
        height='1.8rem'
      />
      <LongInput
        title='아이디 찾기 질문'
        type='text'
        placeholder='가장 좋아하는 작가 이름'
        value={foundAnswer}
        onChange={(e) => setFoundAnswer(e.target.value)}
        height='1.8rem'
      />
      <BottomInputBox>
        <ShortInput
          title='이름'
          type='name'
          placeholder='이름 입력'
          value={name}
          onChange={(e) => setName(e.target.value)}
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
      </BottomInputBox>
      {signupError && <ErrorText>{signupError}</ErrorText>}

      <SignUpButton onClick={handleSignup} disabled={!isFormValid}>
        회원가입
      </SignUpButton>
      <GoogleButton onClick={handleGoogleSignup}>
        <GoogleIconImg src={GoogleIcon} alt='google-icon' />
        Google로 시작하기
      </GoogleButton>
      <TextButton onClick={() => setFormType('로그인')}>
        로그인하러 가기
      </TextButton>
    </>
  );
};

export default SignUpForm;

const ErrorText = styled.p`
  font-size: 0.9rem;
  color: #ca3636;
  align-self: center;
  margin: 20px 0px -5px 0px;
`;

const SignUpButton = styled.button`
  width: 13rem;
  height: 2.7rem;
  background-color: ${(props) => (props.disabled ? '#d3d3d3' : '#563c0a')};
  color: ${(props) => (props.disabled ? '#a9a9a9' : 'white')};
  border-radius: 10px;
  border: none;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  margin-top: 30px;
  font-size: 1rem;
  font-weight: 500;
`;

const GoogleButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 13rem;
  height: 2.7rem;
  background-color: #ffffff;
  color: #5a5a5a;
  border-radius: 10px;
  border: 1px solid #d0d0d0;
  cursor: pointer;
  margin-top: 10px;
  font-size: 0.9rem;
  font-weight: 500;
`;

const GoogleIconImg = styled.img`
  width: 1.1rem;
  margin-right: 10px;
`;

const TextButton = styled.button`
  margin-top: 10px;
  background: none;
  border: none;
  color: #868686;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0 8px;
  margin-top: 30px;
`;

const BottomInputBox = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const DistrictBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 11px;
`;

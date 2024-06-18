import React, { useState } from 'react';
import styled from 'styled-components';
import InvisibleIcon from '../../assets/icons/InvisibleIcon.svg';
import VisibleIcon from '../../assets/icons/VisibleIcon.svg';
import GoogleIcon from '../../assets/icons/GoogleLogo.svg';
import { LongInput } from '../common/LongInput';
import { postLogin, getGoogleLogin, getUserInfo } from '../../api/Auth';

const LoginForm = ({ setFormType, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleLogin = async () => {
    const data = {
      email: email,
      password: password
    };
    try {
      const res = await postLogin(data);
      console.log('로그인 성공:', res);
      // localStorage.setItem('userId', res.data.user.id);
      // localStorage.setItem('userName', res.data.user.name);
      // localStorage.setItem('userRegion', res.data.user.region);
      // localStorage.setItem('favoriteAuthor', res.data.user.favoriteAuthor);
      onClose();
      window.location.href = '/';
    } catch (error) {
      console.error('로그인 실패:', error);
      setLoginError('아이디 또는 비밀번호가 일치하지 않습니다.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      getGoogleLogin();
      // const res = await getUserInfo();
      // console.log('구글 로그인 성공');
      // localStorage.setItem('userId', res.data.user.id);
      // localStorage.setItem('userName', res.data.user.name);
      // localStorage.setItem('userRegion', res.data.user.region);
      // localStorage.setItem('favoriteAuthor', res.data.user.favoriteAuthor);
      // onClose();
      // window.location.href = '/';
    } catch (error) {
      console.error('구글 로그인 실패:', error);
    }
  };

  return (
    <>
      <LongInput
        title='이메일'
        type='email'
        placeholder='이메일 입력'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <PasswordInputContainer>
        <LongInput
          title='비밀번호'
          type={isPasswordVisible ? 'text' : 'password'}
          placeholder='비밀번호 입력'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <VisibilityIcon
          src={isPasswordVisible ? VisibleIcon : InvisibleIcon}
          alt='PasswordVisibility'
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
        />
      </PasswordInputContainer>
      {loginError && <ErrorText>{loginError}</ErrorText>}
      <LoginButton onClick={handleLogin}>로그인</LoginButton>
      <GoogleButton onClick={handleGoogleLogin}>
        <GoogleIconImg src={GoogleIcon} alt='google-icon' />
        Google로 시작하기
      </GoogleButton>
      <ButtonContainer>
        <TextButton onClick={() => setFormType('아이디 찾기')}>
          아이디 찾기
        </TextButton>
        <Divider>|</Divider>
        <TextButton onClick={() => setFormType('비밀번호 찾기')}>
          비밀번호 찾기
        </TextButton>
        <Divider>|</Divider>
        <TextButton onClick={() => setFormType('회원가입')}>
          회원가입
        </TextButton>
      </ButtonContainer>
    </>
  );
};

export default LoginForm;

const PasswordInputContainer = styled.div`
  position: relative;
`;

const VisibilityIcon = styled.img`
  position: absolute;
  right: 1rem;
  top: 2.8rem;
  width: 1.2rem;
  cursor: pointer;
`;

const ErrorText = styled.p`
  font-size: 0.9rem;
  color: #ca3636;
  align-self: center;
  margin-bottom: -10px;
`;

const LoginButton = styled.button`
  width: 13rem;
  height: 2.7rem;
  background-color: #563c0a;
  color: white;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  margin-top: 35px;
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

const ButtonContainer = styled.div`
  margin-top: 45px;
`;

const TextButton = styled.button`
  background: none;
  border: none;
  color: #868686;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0 6px;
`;

const Divider = styled.span`
  color: #d7d7d7;
  margin: 0 2px;
`;

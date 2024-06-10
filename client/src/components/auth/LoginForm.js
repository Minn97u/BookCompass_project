import React, { useState } from 'react';
import styled from 'styled-components';
import InvisibleIcon from '../../assets/icons/InvisibleIcon.svg';
import VisibleIcon from '../../assets/icons/VisibleIcon.svg';
import GoogleIcon from '../../assets/icons/GoogleLogo.svg';

const LoginForm = ({ setFormType }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <>
      <InputContainer>
        <Label>이메일</Label>
        <Input
          label='이메일'
          type='email'
          placeholder='이메일 입력'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Label>비밀번호</Label>
        <PasswordInputContainer>
          <Input
            label='비밀번호'
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
      </InputContainer>
      <LoginButton>로그인</LoginButton>
      <GoogleButton>
        <GoogleIconImg src={GoogleIcon} alt='google-icon' />
        Google로 시작하기
      </GoogleButton>
      <ButtonContainer>
        <TextButton>아이디 찾기</TextButton>
        <Divider>|</Divider>
        <TextButton>비밀번호 찾기</TextButton>
        <Divider>|</Divider>
        <TextButton onClick={() => setFormType('회원가입')}>
          회원가입
        </TextButton>
      </ButtonContainer>
    </>
  );
};

export default LoginForm;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Label = styled.p`
  font-size: 0.9rem;
  color: #191619;
  margin-bottom: 6px;
`;

const Input = styled.input`
  width: 22rem;
  height: 2.1rem;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  padding: 5px 12px 5px 12px;
  margin-bottom: 7px;

  &::placeholder {
    color: #bababa;
  }
`;

const PasswordInputContainer = styled.div`
  position: relative;
`;

const VisibilityIcon = styled.img`
  position: absolute;
  right: 1rem;
  top: 1rem;
  width: 1.2rem;
  cursor: pointer;
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

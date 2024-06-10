import React, { useState } from 'react';
import styled from 'styled-components';
import SignUpDistrict from './SignUpDistrict';
import Districts from './Districts';
import GoogleIcon from '../../assets/icons/GoogleLogo.svg';

const SignUpForm = ({ setFormType }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [foundAnswer, setFoundAnswer] = useState('');
  const [name, setName] = useState('');
  const [checkEmailText, setCheckEmailText] = useState('');
  const [checkPasswordText, setCheckPasswordText] = useState('');

  const emailRegEx =
    /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/i;

  const emailCheck = (email) => {
    const isValid = emailRegEx.test(email);
    if (!isValid) {
      setCheckEmailText('이메일 형식이 일치하지 않습니다.');
    } else {
      setCheckEmailText('');
    }
    return isValid;
  };

  const passwordCheck = (password, checkPassword) => {
    if (password !== checkPassword) {
      setCheckPasswordText('비밀번호가 일치하지 않습니다.');
      return;
    } else {
      setCheckPasswordText('');
    }
  };

  return (
    <>
      <InputContainer>
        <LabelContainer>
          <Label>이메일</Label>
          <CheckText>{checkEmailText}</CheckText>
        </LabelContainer>
        <Input
          label='이메일'
          type='email'
          placeholder='이메일 입력'
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            emailCheck(e.target.value);
          }}
        />
        <Label>비밀번호</Label>
        <Input
          label='비밀번호'
          type='password'
          placeholder='비밀번호 입력'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <LabelContainer>
          <Label>비밀번호 확인</Label>
          <CheckText>{checkPasswordText}</CheckText>
        </LabelContainer>
        <Input
          label='비밀번호 확인'
          type='password'
          placeholder='비밀번호 입력'
          value={checkPassword}
          onChange={(e) => {
            setCheckPassword(e.target.value);
            passwordCheck(password, e.target.value);
          }}
        />
        <Label>아이디 찾기 질문</Label>
        <Input
          label='아이디 찾기 질문'
          type='text'
          placeholder='가장 좋아하는 작가 이름'
          value={foundAnswer}
          onChange={(e) => setFoundAnswer(e.target.value)}
        />
        <BottomInputBox>
          <BottomBox>
            <Label>이름</Label>
            <NameInput
              label='이름'
              type='name'
              placeholder='이름 입력'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </BottomBox>
          <BottomBox>
            <Label>기본 위치 설정</Label>
            <SignUpDistrict options={Districts} location='서울특별시' />
          </BottomBox>
        </BottomInputBox>
      </InputContainer>
      <SignUpButton>회원가입</SignUpButton>
      <GoogleButton>
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

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: -10px;
`;

const LabelContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.p`
  font-size: 0.9rem;
  color: #191619;
  margin-bottom: 6px;
`;

const CheckText = styled.p`
  font-size: 0.8rem;
  color: #ca3636;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 22rem;
  height: 1.8rem;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  padding: 5px 12px 5px 12px;
  margin-top: -2px;
  margin-bottom: -5px;

  &::placeholder {
    color: #bababa;
  }
`;

const NameInput = styled.input`
  width: 10rem;
  height: 1.7rem;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  padding: 5px 12px 5px 12px;
  margin: -2px 10px 5px 0px;
`;

const SignUpButton = styled.button`
  width: 13rem;
  height: 2.7rem;
  background-color: #563c0a;
  color: white;
  border-radius: 10px;
  border: none;
  cursor: pointer;
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
`;

const BottomBox = styled.div`
  display: flex;
  flex-direction: column;
`;

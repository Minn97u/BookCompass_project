import React, { useState } from 'react';
import styled from 'styled-components';
import SignUpDistrict from './SignUpDistrict';
import Districts from './Districts';
import GoogleIcon from '../../assets/icons/GoogleLogo.svg';
import { LongInput } from '../common/LongInput';
import { ShortInput } from '../common/ShortInput';
import { postSignup, getGoogleSignup } from '../../api/Auth';

const emailRegEx =
  /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/i;

const SignUpForm = ({ setFormType }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [foundAnswer, setFoundAnswer] = useState('');
  const [name, setName] = useState('');
  const [region, setRegion] = useState('');
  const [checkEmailText, setCheckEmailText] = useState('');
  const [checkPasswordText, setCheckPasswordText] = useState('');
  const [signupError, setSignupError] = useState('');

  const emailCheck = (email) => {
    const isValid = emailRegEx.test(email);
    setCheckEmailText(isValid ? '' : '이메일 형식이 일치하지 않습니다.');

    return isValid;
  };

  const passwordCheck = (password, checkPassword) => {
    setCheckPasswordText(
      password !== checkPassword ? '비밀번호가 일치하지 않습니다.' : ''
    );
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
      setSignupError('모두 입력해 주세요.');
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await getGoogleSignup();
      console.log('구글 회원가입 완료');
    } catch (error) {
      console.error('구글 회원가입 오류:', error);
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
        onChange={(e) => setPassword(e.target.value)}
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

      <SignUpButton onClick={handleSignup}>회원가입</SignUpButton>
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
  width: 100%;
`;

const DistrictBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 11px;
`;

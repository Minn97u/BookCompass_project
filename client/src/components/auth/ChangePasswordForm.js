import React, { useState } from 'react';
import styled from 'styled-components';
import { LongInput } from '../common/LongInput';
import { postChangePassword } from '../../api/Auth';

const ChangePasswordForm = ({ setFormType }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [checkNewPassword, setCheckNewPassword] = useState('');
  const [checkPasswordText, setCheckPasswordText] = useState('');
  const [resultText, setResultText] = useState('');

  const passwordCheck = (password, checkPassword) => {
    setCheckPasswordText(
      password !== checkPassword ? '비밀번호가 일치하지 않습니다.' : ''
    );
  };

  const handleChangePassword = async () => {
    const data = {
      currentPassword,
      newPassword
    };

    try {
      const res = await postChangePassword(data);
      console.log('비밀번호 변경 완료', res);
      setFormType('로그인');
    } catch (error) {
      console.error('비밀번호 변경 오류:', error);
      setResultText('모두 입력해 주세요.');
    }
  };

  return (
    <>
      <InputContainer>
        <LongInput
          title='현재 비밀번호'
          type='password'
          placeholder='현재 비밀번호 입력'
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <LongInput
          title='새로운 비밀번호'
          type='password'
          placeholder='비밀번호 입력'
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <LongInput
          title='새로운 비밀번호 확인'
          type='password'
          placeholder='비밀번호 입력'
          value={checkNewPassword}
          onChange={(e) => {
            setCheckNewPassword(e.target.value);
            passwordCheck(newPassword, e.target.value);
          }}
          checkText={checkPasswordText}
        />
      </InputContainer>
      {resultText && <ErrorText>{resultText}</ErrorText>}
      <ChangeButton onClick={handleChangePassword}>변경</ChangeButton>
      <TextButton onClick={() => setFormType('로그인')}>
        로그인하러 가기
      </TextButton>
    </>
  );
};

export default ChangePasswordForm;

const InputContainer = styled.div`
  margin-top: 20px;
`;

const ErrorText = styled.p`
  font-size: 0.9rem;
  color: #ca3636;
  align-self: center;
  margin: 20px 0px -5px 0px;
`;

const ChangeButton = styled.button`
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

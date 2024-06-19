import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { LongInput } from '../common/LongInput';
import { postChangePassword, getLogout } from '../../api/Auth';

const passwordRegEx = /^.{8,}$/;
const ChangePasswordForm = ({ setFormType }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [checkNewPassword, setCheckNewPassword] = useState('');
  const [checkPasswordText, setCheckPasswordText] = useState('');
  const [checkPasswordReg, setCheckPasswordReg] = useState('');
  const [resultText, setResultText] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const validateForm = () => {
      const isValid =
        passwordRegCheck(newPassword) &&
        newPassword === checkNewPassword &&
        currentPassword.trim() !== '' &&
        checkPasswordText === '' &&
        checkPasswordReg === '';
      setIsFormValid(isValid);

      if (isValid) {
        setResultText('');
      } else {
        setResultText('모두 입력해 주세요.');
      }
    };

    validateForm();
  }, [
    currentPassword,
    newPassword,
    checkNewPassword,
    checkPasswordText,
    checkPasswordReg
  ]);

  const passwordCheck = (newPassword, checkNewPassword) => {
    if (newPassword !== checkNewPassword) {
      setCheckPasswordText('비밀번호가 일치하지 않습니다.');
    } else {
      setCheckPasswordText('');
    }
  };

  const passwordRegCheck = (newPassword) => {
    const isValid = passwordRegEx.test(newPassword);
    setCheckPasswordReg(
      isValid ? '' : '비밀번호는 최소 8자 이상으로 설정해주세요.'
    );

    return isValid;
  };

  const handleChangePassword = async () => {
    const data = {
      currentPassword,
      newPassword
    };

    if (isFormValid) {
      try {
        const res = await postChangePassword(data);
        console.log('비밀번호 변경 완료', res);
        // setFormType('로그인');
        await getLogout();
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRegion');
        localStorage.removeItem('favoriteAuthor');
        window.location.href = '/';
        window.alert('다시 로그인 해주세요');
      } catch (error) {
        console.error('비밀번호 변경 오류:', error);
        setResultText(error.response?.data?.msg);
      }
    } else {
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
          onChange={(e) => {
            setNewPassword(e.target.value);
            passwordRegCheck(e.target.value);
          }}
          checkText={checkPasswordReg}
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
      <ChangeButton onClick={handleChangePassword} disabled={!isFormValid}>
        변경
      </ChangeButton>
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
  background-color: ${(props) => (props.disabled ? '#d3d3d3' : '#563c0a')};
  color: ${(props) => (props.disabled ? '#a9a9a9' : 'white')};
  border-radius: 10px;
  border: none;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
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

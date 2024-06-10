import React, { useState } from 'react';
import styled from 'styled-components';
import { LongInput } from '../common/LongInput';

const ChangePasswordForm = ({ setFormType }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [changePassword, setChangePassword] = useState('');
  const [checkChangePassword, setCheckChangePassword] = useState('');
  const [checkPasswordText, setCheckPasswordText] = useState('');

  const passwordCheck = (password, checkPassword) => {
    setCheckPasswordText(
      password !== checkPassword ? '비밀번호가 일치하지 않습니다.' : ''
    );
  };

  return (
    <>
      <LongInput
        title='비밀번호'
        type='password'
        placeholder='비밀번호 입력'
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />
      <LongInput
        title='비밀번호'
        type='password'
        placeholder='비밀번호 입력'
        value={changePassword}
        onChange={(e) => setChangePassword(e.target.value)}
      />
      <LongInput
        title='비밀번호 확인'
        type='password'
        placeholder='비밀번호 입력'
        value={checkChangePassword}
        onChange={(e) => {
          setCheckChangePassword(e.target.value);
          passwordCheck(currentPassword, e.target.value);
        }}
        checkText={checkPasswordText}
      />
    </>
  );
};

export default ChangePasswordForm;

import React, { useState } from 'react';
import DefaultModal from '../common/DefaultModal';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import FindEmailForm from './FindEmailForm';
import FindPasswordForm from './FindPasswordForm';
import ChangePasswordForm from './ChangePasswordForm';

const AuthFunnel = {
  LOGIN: '로그인',
  SIGNUP: '회원가입',
  EDIT: '기본 정보 수정',
  FINDID: '아이디 찾기',
  FINDPW: '비밀번호 찾기',
  CHANGEPW: '비밀번호 변경'
};

const AuthModal = ({ onClose, initialFormType }) => {
  const [formType, setFormType] = useState(initialFormType);

  const renderForm = () => {
    switch (formType) {
      case AuthFunnel.LOGIN:
        return <LoginForm setFormType={setFormType} onClose={onClose} />;
      case AuthFunnel.SIGNUP:
        return <SignUpForm setFormType={setFormType} />;
      case AuthFunnel.FINDID:
        return <FindEmailForm setFormType={setFormType} />;
      case AuthFunnel.FINDPW:
        return <FindPasswordForm setFormType={setFormType} />;
      case AuthFunnel.CHANGEPW:
        return <ChangePasswordForm setFormType={setFormType} />;
      default:
        return null;
    }
  };

  return (
    <DefaultModal
      title={formType}
      component={renderForm()}
      onClose={onClose}
    ></DefaultModal>
  );
};

export default AuthModal;

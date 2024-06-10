import React, { useState } from 'react';
import AuthModal from './AuthModal';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import ProfileEditForm from '../mypage/ProfileEditForm';
import FindEmailForm from './FindEmailForm';
import FindPasswordForm from './FindPasswordForm';

const AuthFunnel = {
  LOGIN: '로그인',
  SIGNUP: '회원가입',
  EDIT: '개인 정보 수정',
  FINDID: '아이디 찾기',
  FINDPW: '비밀번호 찾기'
};

const AuthModalController = ({ onClose, initialFormType }) => {
  const [formType, setFormType] = useState(initialFormType);

  const renderForm = () => {
    switch (formType) {
      case AuthFunnel.LOGIN:
        return <LoginForm setFormType={setFormType} />;
      case AuthFunnel.SIGNUP:
        return <SignUpForm setFormType={setFormType} />;
      case AuthFunnel.EDIT:
        return <ProfileEditForm />;
      case AuthFunnel.FINDID:
        return <FindEmailForm setFormType={setFormType} />;
      case AuthFunnel.FINDPW:
        return <FindPasswordForm setFormType={setFormType} />;
      default:
        return null;
    }
  };

  return (
    <AuthModal
      title={formType}
      component={renderForm()}
      onClose={onClose}
    ></AuthModal>
  );
};

export default AuthModalController;

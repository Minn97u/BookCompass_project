import React, { useState } from 'react';
import AuthModal from './AuthModal';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import ProfileEditForm from '../mypage/ProfileEditForm';

const AuthModalController = ({ onClose, initialFormType }) => {
  const [formType, setFormType] = useState(initialFormType);

  const renderForm = () => {
    switch (formType) {
      case '로그인':
        return <LoginForm setFormType={setFormType} />;
      case '회원가입':
        return <SignUpForm setFormType={setFormType} />;
      case '기본 정보 수정':
        return <ProfileEditForm />;
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

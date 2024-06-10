import React, { useState } from 'react';
import styled from 'styled-components';
import SignUpDistrict from '../auth/SignUpDistrict';
import Districts from '../auth/Districts';
import EditImg from '../../assets/icons/EditImg.svg';

const ProfileEditForm = () => {
  const [name, setName] = useState('나경윤');
  const [description, setDescription] = useState('내용을 추가하세요.');
  const [foundAnswer, setFoundAnswer] = useState('김초엽');
  const [password, setPassword] = useState('');
  const [changePassword, setChangePassword] = useState('');
  const location = '광진구';

  return (
    <Container>
      <EditProfile>
        <Title>프로필</Title>
        <Hr />
        <ProfileContainer>
          <EditProfileImg>
            <img src={EditImg} alt='edit-profile-img' />
          </EditProfileImg>
          <InputConatiner>
            <Label>이름</Label>
            <NameInput
              label='이름'
              type='name'
              placeholder='이름 입력'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Label>소개</Label>
            <IntroInput
              label='소개'
              type='text'
              placeholder='소개 입력'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </InputConatiner>
        </ProfileContainer>
        <EditBtn>수정</EditBtn>
      </EditProfile>
      <EditInfo>
        <Title>개인 정보</Title>
        <Hr />
        <InputConatiner>
          <InfoBox>
            <InputBox>
              <Label>기본 위치 설정</Label>
              <SignUpDistrict options={Districts} location={location} />
            </InputBox>
          </InfoBox>
          <InfoBox>
            <InputBox>
              <Label>아이디 찾기 질문 - 좋아하는 작가 이름은?</Label>
              <AnswerInput
                label='아이디 찾기 질문'
                type='text'
                placeholder={foundAnswer}
                value={foundAnswer}
                onChange={(e) => setName(e.target.value)}
              />
            </InputBox>
            <InfoEditBtn>수정</InfoEditBtn>
          </InfoBox>
          <PasswordContainer>
            <InputBox>
              <Label>비밀번호 변경</Label>
              <PasswordBox>
                <PasswordInput
                  label='비밀번호 변경'
                  type='password'
                  placeholder='현재 비밀번호'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <PasswordInput
                  label='비밀번호 변경'
                  type='password'
                  placeholder='변경할 비밀번호'
                  value={changePassword}
                  onChange={(e) => setChangePassword(e.target.value)}
                />
              </PasswordBox>
            </InputBox>
            <EditBtn>변경</EditBtn>
          </PasswordContainer>
        </InputConatiner>
      </EditInfo>
    </Container>
  );
};

export default ProfileEditForm;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const EditProfile = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Title = styled.p`
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 10px;
  margin-top: 20px;
`;

const Hr = styled.hr`
  border: none;
  border-top: 1px solid #dfdfdf;
  width: 100%;
  margin-top: -5px;
`;

const EditProfileImg = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 6rem;
  height: 6rem;
  background-color: #ffffff;
  border: 1px solid #dfdfdf;
  border-radius: 50%;
  cursor: pointer;
  margin-right: 40px;
`;

const InputConatiner = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.p`
  font-size: 0.9rem;
  font-weight: 500;
  color: #191619;
  margin-bottom: 6px;
`;

const NameInput = styled.input`
  width: 15rem;
  height: 2rem;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  padding: 3px 12px 3px 12px;
  margin: -2px 10px 5px 0px;
  font-size: 0.9rem;
`;

const IntroInput = styled.textarea`
  width: 15.3rem;
  height: 4rem;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  padding: 10px;
  margin: -2px 10px 5px 0px;
  font-size: 0.9rem;
  resize: none;
  white-space: pre-wrap;
  overflow-wrap: break-word;
`;

const EditBtn = styled.button`
  font-size: 0.9rem;
  font-weight: 500;
  color: white;
  width: 3.3rem;
  margin-top: 10px;
  padding: 5px 10px 5px 10px;
  border: none;
  border-radius: 10px;
  background-color: #563c0a;
  align-self: flex-end;
  margin-right: 10px;
  cursor: pointer;
`;

const EditInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const AnswerInput = styled.input`
  width: 13rem;
  height: 2rem;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  padding: 3px 12px 3px 12px;
  margin: -2px 10px 5px 0px;
  font-size: 0.9rem;
`;

const InfoBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
`;

const InputBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const PasswordBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const InfoEditBtn = styled.button`
  font-size: 0.9rem;
  font-weight: 500;
  color: white;
  width: 3.3rem;
  padding: 5px 10px 5px 10px;
  border: none;
  border-radius: 10px;
  background-color: #563c0a;
  margin-right: 10px;
  margin-top: 30px;
  cursor: pointer;
`;

const PasswordInput = styled.input`
  width: 11rem;
  height: 2rem;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  padding: 3px 12px 3px 12px;
  margin: -2px 10px 5px 0px;
  font-size: 0.9rem;
`;

const PasswordContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

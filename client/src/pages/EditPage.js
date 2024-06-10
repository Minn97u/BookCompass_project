import React, { useState } from 'react';
import styled from 'styled-components';
import SignUpDistrict from '../components/auth/SignUpDistrict';
import Districts from '../components/auth/Districts';
import EditImg from '../assets/icons/EditImg.svg';

const EditPage = () => {
  const [name, setName] = useState('나경윤');
  const [description, setDescription] = useState('내용을 추가하세요.');
  const [foundAnswer, setFoundAnswer] = useState('김초엽');
  const [region, setRegion] = useState('');
  const [password, setPassword] = useState('');
  const [changePassword, setChangePassword] = useState('');
  const location = '광진구';

  return (
    <Container>
      <EditBox>
        <Title>기본 정보 수정</Title>
        <EditProfile>
          <SubTitle>프로필</SubTitle>
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
            <EditBtn>수정</EditBtn>
          </ProfileContainer>
        </EditProfile>
        <EditInfo>
          <SubTitle>개인 정보</SubTitle>
          <Hr />
          <InfoBox>
            <InputBox>
              <SignUpDistrict
                options={Districts}
                location={location}
                selectedOption={region}
                setSelectedOption={setRegion}
              />

              <Label>아이디 찾기 질문 - 좋아하는 작가 이름은?</Label>
              <AnswerInput
                label='아이디 찾기 질문'
                type='text'
                placeholder={foundAnswer}
                value={foundAnswer}
                onChange={(e) => setName(e.target.value)}
              />
            </InputBox>
            <EditBtn>수정</EditBtn>
          </InfoBox>
        </EditInfo>
        <Hr />
        <EditAccount>
          <TextButton>비밀번호 변경</TextButton>
          <Divider>|</Divider>
          <TextButton>회원 탈퇴</TextButton>
        </EditAccount>
      </EditBox>
    </Container>
  );
};

export default EditPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
`;

const EditBox = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #f1f1f1;
  border-radius: 5px;
  box-shadow: 0px 3px 18px rgba(0, 0, 0, 0.04);
  width: 45rem;
  height: 42rem;
  padding: 20px 50px 33px 50px;
  box-sizing: border-box;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 8px;
    background-color: #efefef;
  }
`;

const Title = styled.div`
  font-size: 1.5rem;
  font-weight: 500;
  margin: 25px 0px 20px 0px;
`;

const SubTitle = styled.p`
  font-size: 1.2rem;
  font-weight: 400;
  margin: 15px 0px 10px 50px;
  align-self: start;
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
  justify-content: center;
`;

const Hr = styled.hr`
  border: none;
  border-top: 1px solid #dfdfdf;
  width: 85%;
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
  margin-right: 50px;
`;

const InputConatiner = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 20px;
`;

const Label = styled.p`
  font-size: 0.9rem;
  font-weight: 500;
  color: #191619;
  margin-bottom: 6px;
  align-self: start;
`;

const NameInput = styled.input`
  width: 13rem;
  height: 2.1rem;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  padding: 3px 12px 3px 12px;
  margin: -2px 10px -2px 0px;
  font-size: 0.9rem;
`;

const IntroInput = styled.textarea`
  width: 13.2rem;
  height: 3rem;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  padding: 10px;
  margin: -2px 10px 0px 0px;
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
  padding: 5px 10px 5px 10px;
  border: none;
  border-radius: 10px;
  background-color: #563c0a;
  align-self: flex-end;
  cursor: pointer;
  margin-bottom: 2px;
`;

const EditInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 0px 30px 0px;
`;

const AnswerInput = styled.input`
  width: 18rem;
  height: 2.1rem;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  padding: 3px 12px 3px 12px;
  margin-top: -2px;
  font-size: 0.9rem;
`;

const InfoBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  text-align: left;
  margin: 5px 75px;
`;

const InputBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const EditAccount = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 15px 0px 45px 50px;
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
  margin: 0px 2px 3px 2px;
`;

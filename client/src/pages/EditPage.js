import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import EditInfo from '../components/edit/EditInfo';
import EditProfile from '../components/edit/EditProfile';
import AuthModal from '../components/auth/AuthModal';
import { getProfileInfo } from '../api/Mypage';

const EditPage = () => {
  const [myProfile, setMyProfile] = useState({
    profileImg: '',
    name: '',
    description: ''
  });
  const [myInfo, setMyInfo] = useState({
    foundAnswer: localStorage.getItem('favoriteAuthor'),
    region: localStorage.getItem('userRegion')
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [formType, setFormType] = useState(null);

  const handlePasswordChangeClick = () => {
    setFormType('비밀번호 변경');
    setModalVisible(true);
  };

  const fetchProfileInfo = async () => {
    try {
      const res = await getProfileInfo();
      console.log('프로필 가져오기:', res);
      const { profilePic, name, profileMsg } = res.data;
      setMyProfile({
        profileImg: profilePic,
        name,
        description: profileMsg
      });
    } catch (error) {
      console.error('프로필 가져오기 실패:', error);
    }
  };

  useEffect(() => {
    fetchProfileInfo();
  }, []);

  return (
    <Container>
      <EditBox>
        <Title>기본 정보 수정</Title>
        <EditProfile profile={myProfile} setProfile={setMyProfile} />
        <EditInfo myInfo={myInfo} setMyInfo={setMyInfo} />
        <Hr />
        <EditAccount>
          <TextButton onClick={handlePasswordChangeClick}>
            비밀번호 변경
          </TextButton>
          <Divider>|</Divider>
          <TextButton>회원 탈퇴</TextButton>
        </EditAccount>
      </EditBox>
      {modalVisible && (
        <AuthModal
          onClose={() => setModalVisible(false)}
          initialFormType={formType}
        />
      )}
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

const Hr = styled.hr`
  border: none;
  border-top: 1px solid #dfdfdf;
  width: 85%;
  margin-top: -5px;
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

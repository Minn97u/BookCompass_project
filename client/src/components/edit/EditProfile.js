import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { putProfileInfo } from '../../api/Mypage';

const EditProfile = ({
  profileImg,
  setProfileImg,
  name,
  setName,
  description,
  setDescription
}) => {
  const [profileImgFile, setProfileImgFile] = useState(profileImg);
  const [editText, setEditText] = useState('수정');
  const [formData, setFormData] = useState(new FormData());
  const imageInput = useRef();

  const handleImageUploadClick = () => {
    imageInput.current.click();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imgUrl = reader.result;
        setProfileImg(imgUrl);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleEditProfileInfo = async () => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('profileMsg', description);

      const file = imageInput.current.files[0];
      if (file) {
        formData.append('profilePic', file);
      }

      const res = await putProfileInfo(formData);
      console.log('프로필 편집 성공', res);
      setEditText('성공!');
      setTimeout(() => {
        setEditText('수정');
      }, 1000);
    } catch (error) {
      console.error('프로필 편집 실패:', error);
    }
  };

  return (
    <EditProfileContainer>
      <SubTitle>프로필</SubTitle>
      <Hr />
      <ProfileContainer>
        <EditImgBox>
          <ProfileImgWrapper onClick={handleImageUploadClick}>
            <ProfileImg src={profileImg} alt='edit-profile-img' />
          </ProfileImgWrapper>
          <FileInput
            type='file'
            accept='.jpg, .jpeg, .png'
            ref={imageInput}
            onChange={handleImageUpload}
          />
        </EditImgBox>
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
        <EditBtn onClick={handleEditProfileInfo}>{editText}</EditBtn>
      </ProfileContainer>
    </EditProfileContainer>
  );
};

export default EditProfile;

const EditProfileContainer = styled.div`
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

const EditImgBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ProfileImgWrapper = styled.div`
  position: relative;
  width: 6.5rem;
  height: 6.5rem;
  border: 1px solid #dfdfdf;
  border-radius: 50%;
  cursor: pointer;
  margin-right: 50px;
  box-sizing: border-box;

  &:hover {
    border: 2px solid #afafaf;
  }

  &:hover::after {
    content: '편집';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
  }
`;

const ProfileImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;

const FileInput = styled.input`
  display: none;
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

const SubTitle = styled.p`
  font-size: 1.2rem;
  font-weight: 400;
  margin: 15px 0px 10px 50px;
  align-self: start;
`;

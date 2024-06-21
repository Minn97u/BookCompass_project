import { useState, useRef } from 'react';
import { useMutation } from 'react-query';
import styled from 'styled-components';
import { putProfileInfo } from '../../api/Mypage';
import DefaultButton from '../common/DefaultButton';

const EditProfile = ({ profile, setProfile }) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [resultText, setResultText] = useState('');
  const imageInput = useRef();

  const isFormValid =
    profile.name &&
    profile.name.trim() !== '' &&
    profile.description &&
    profile.description.trim() !== '';

  const handleImageUploadClick = () => {
    imageInput.current.click();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imgUrl = reader.result;
        setProfile((prev) => ({ ...prev, profileImg: imgUrl }));
      };

      reader.readAsDataURL(file);
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: putProfileInfo
  });

  const handleEditProfileInfo = () => {
    if (!isFormValid) {
      setResultText('모두 입력해 주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('name', profile.name);
    formData.append('profileMsg', profile.description);
    const file = imageInput.current.files[0];
    if (file) {
      formData.append('profilePic', file);
    }

    const data = putProfileInfo(formData);

    mutate(data, {
      onSuccess: () => {
        localStorage.setItem('userRegion', data.region);
        localStorage.setItem('favoriteAuthor', data.favoriteAuthor);
        setIsButtonDisabled(true);
      },
      onError: (err) => {
        console.error(err);
        alert('실패');
      },
      onSettled: () => {
        setTimeout(() => {
          setIsButtonDisabled(false);
        }, 300);
      }
    });
  };

  return (
    <EditProfileContainer>
      <SubTitle>프로필</SubTitle>
      <Hr />
      <ProfileContainer>
        <EditImgBox>
          <ProfileImgWrapper onClick={handleImageUploadClick}>
            <ProfileImg src={profile.profileImg} alt='edit-profile-img' />
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
            value={profile.name}
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <Label>소개</Label>
          <IntroInput
            label='소개'
            type='text'
            placeholder='소개 입력'
            value={profile.description}
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, description: e.target.value }))
            }
          />
        </InputConatiner>
        <DefaultButton
          onClick={handleEditProfileInfo}
          disabled={isButtonDisabled || isPending}
        >
          수정
        </DefaultButton>
      </ProfileContainer>
      {resultText && <ErrorText>{resultText}</ErrorText>}
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
  width: 7rem;
  height: 7rem;
  border: 1px solid #dfdfdf;
  border-radius: 50%;
  cursor: pointer;
  margin-right: 40px;
  box-sizing: border-box;

  &:hover img {
    filter: brightness(0.7);
  }

  &:hover::after {
    content: '편집';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    z-index: 1; /* 텍스트가 이미지 위에 보이도록 설정 */
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

const SubTitle = styled.p`
  font-size: 1.2rem;
  font-weight: 400;
  margin: 15px 0px 10px 50px;
  align-self: start;
`;

const ErrorText = styled.p`
  font-size: 0.9rem;
  color: #ca3636;
  align-self: center;
  margin: 15px 0px 0px 65px;
`;

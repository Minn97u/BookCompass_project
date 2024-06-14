import React, { useState } from 'react';
import styled from 'styled-components';
import Districts from '../auth/Districts';
import SignUpDistrict from '../auth/SignUpDistrict';
import { postUserInfo } from '../../api/Auth';

const EditInfo = ({ myInfo, setMyInfo }) => {
  const [editText, setEditText] = useState('수정');
  const [resultText, setResultText] = useState('');

  const isFormValid = myInfo.region !== '' && myInfo.foundAnswer.trim() !== '';

  const handleEditUserInfo = async () => {
    const data = {
      region: myInfo.region || '',
      favoriteAuthor: myInfo.foundAnswer
    };

    if (isFormValid) {
      try {
        const res = await postUserInfo(data);
        console.log('유저 정보 편집 성공:', res);
        setResultText('');
        setEditText('완료!');
        setTimeout(() => {
          setEditText('수정');
        }, 1000);
        localStorage.setItem('userRegion', data.region);
        localStorage.setItem('favoriteAuthor', data.favoriteAuthor);
      } catch (error) {
        console.error('유저 정보 편집 실패:', error);
      }
    } else {
      setResultText('모두 입력해 주세요.');
    }
  };

  return (
    <EditInfoContainer>
      <SubTitle>개인 정보</SubTitle>
      <Hr />
      <InfoBox>
        <InputBox>
          <SignUpDistrict
            options={Districts}
            selectedOption={myInfo.region}
            setSelectedOption={(region) =>
              setMyInfo((prev) => ({ ...prev, region }))
            }
          />
          <Label>아이디 찾기 질문 - 좋아하는 작가 이름은?</Label>
          <AnswerInput
            label='아이디 찾기 질문'
            type='text'
            placeholder={myInfo.foundAnswer}
            value={myInfo.foundAnswer}
            onChange={(e) =>
              setMyInfo((prev) => ({ ...prev, foundAnswer: e.target.value }))
            }
          />
        </InputBox>
        <EditBtn onClick={handleEditUserInfo}>{editText}</EditBtn>
      </InfoBox>
      {resultText && <ErrorText>{resultText}</ErrorText>}
    </EditInfoContainer>
  );
};

export default EditInfo;

const EditInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 15px 0px 30px 0px;
`;

const Hr = styled.hr`
  border: none;
  border-top: 1px solid #dfdfdf;
  width: 85%;
  margin-top: -5px;
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

const Label = styled.p`
  font-size: 0.9rem;
  font-weight: 500;
  color: #191619;
  margin-bottom: 6px;
  align-self: start;
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
  margin: 5px 0px 10px 50px;
  align-self: start;
`;

const ErrorText = styled.p`
  font-size: 0.9rem;
  color: #ca3636;
  text-align: left;
  margin: 10px 0px -5px 75px;
`;

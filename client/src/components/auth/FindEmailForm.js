import React, { useState } from 'react';
import styled from 'styled-components';
import SignUpDistrict from './SignUpDistrict';
import Districts from './Districts';
import { LongInput } from '../common/LongInput';
import { ShortInput } from '../common/ShortInput';
import { postFindEmail } from '../../api/Auth';

const FindEmailForm = ({ setFormType }) => {
  const [name, setName] = useState('');
  const [region, setRegion] = useState('');
  const [foundAnswer, setFoundAnswer] = useState('');
  const [resultText, setResultText] = useState('');

  const handleFindEmail = async () => {
    const data = {
      name,
      region,
      favoriteAuthor: foundAnswer
    };
    try {
      const res = await postFindEmail(data);
      console.log('이메일 찾기 성공', res.data[0].email);
      setResultText(`가입 이메일 : ${res.data[0].email}`);
    } catch (error) {
      console.error('이메일 찾기 실패:', error);
      const status = error.response?.status;
      if (status === 404) {
        setResultText('가입되지 않은 계정입니다.');
      } else if (status === 400) {
        setResultText('소셜 로그인 회원입니다.');
      } else {
        console.error('이메일 찾기 실패:', error);
      }
    }
  };

  return (
    <>
      <ShortInputContainer>
        <ShortInput
          title='이름'
          type='name'
          placeholder='이름 입력'
          value={name}
          onChange={(e) => setName(e.target.value)}
          height='1.8rem'
        />
        <DistrictBox>
          <SignUpDistrict
            options={Districts}
            location='서울특별시'
            selectedOption={region}
            setSelectedOption={setRegion}
          />
        </DistrictBox>
      </ShortInputContainer>
      <LongInput
        title='아이디 찾기 질문'
        type='text'
        placeholder='가장 좋아하는 작가 이름'
        value={foundAnswer}
        onChange={(e) => setFoundAnswer(e.target.value)}
      />
      <ResultText>{resultText}</ResultText>
      <FindButton onClick={handleFindEmail}>찾기</FindButton>
      <ButtonContainer>
        <TextButton onClick={() => setFormType('로그인')}>
          로그인하러 가기
        </TextButton>
      </ButtonContainer>
    </>
  );
};

export default FindEmailForm;

const ShortInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  margin: 30px 0px 5px -20px;
`;

const DistrictBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 11px;
`;

const ResultText = styled.p`
  font-size: 0.9rem;
  color: #ca3636;
  align-self: center;
  margin-bottom: -10px;
`;

const FindButton = styled.button`
  width: 13rem;
  height: 2.7rem;
  background-color: #563c0a;
  color: white;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  margin-top: 35px;
  font-size: 1rem;
  font-weight: 500;
`;

const TextButton = styled.button`
  background: none;
  border: none;
  color: #868686;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0 8px;
  margin-top: 30px;
`;

const ButtonContainer = styled.div`
  margin-top: 20px;
`;

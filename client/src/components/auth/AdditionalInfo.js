import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { postUserInfo, getLogout, getUserInfo } from '../../api/Auth';
import Districts from './Districts';
import { LongInput } from '../common/LongInput';
import { ShortInput } from '../common/ShortInput';
import SignUpDistrict from './SignUpDistrict';

const AdditionalInfo = () => {
  const [favoriteAuthor, setFavoriteAuthor] = useState('');
  const [region, setRegion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleLogout = (e) => {
      getLogout();
    };
    window.addEventListener('beforeunload', handleLogout);
    return () => {
      window.removeEventListener('beforeunload', handleLogout);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (favoriteAuthor.trim() === '' || region.trim() === '') {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const data = {
        favoriteAuthor,
        region
      };
      const res = await postUserInfo(data);
      if (res.data.submit) {
        await getUserInfo();
        window.location.href = '/';
        window.alert('다시 로그인 해주세요');
      } else {
        alert('Failed to update user info');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error updating user info:', error);
      setIsSubmitting(false);
    }
  };

  const isFormValid = favoriteAuthor.trim() !== '' && region.trim() !== '';

  return (
    <div>
      <h2>Enter Additional Information</h2>
      <form onSubmit={handleSubmit}>
        {/* <label>
          Favorite Author:
          <input
            type='text'
            value={favoriteAuthor}
            onChange={(e) => setFavoriteAuthor(e.target.value)}
            required
          />
        </label> */}
        <LongInput
          title='아이디 찾기 질문'
          type='text'
          placeholder='가장 좋아하는 작가 이름'
          value={favoriteAuthor}
          onChange={(e) => setFavoriteAuthor(e.target.value)}
          height='1.8rem'
        />
        <br />
        {/* <label>
          Region:
          <input
            type='text'
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            required
          />
        </label> */}
        <BottomInputBox>
          <DistrictBox>
            <SignUpDistrict
              options={Districts}
              location='서울특별시'
              selectedOption={region}
              setSelectedOption={setRegion}
            />
          </DistrictBox>
        </BottomInputBox>
        <br />
        <button type='submit' disabled={!isFormValid || isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default AdditionalInfo;

const BottomInputBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  text-align: center;
`;

const DistrictBox = styled.div`
  display: flex;
  flex-direction: column;
`;

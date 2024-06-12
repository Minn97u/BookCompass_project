const baseURL = 'http://localhost:5000';
import axios from 'axios';

export const getProfileInfo = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/mypage/profile`, {
      withCredentials: true
    });
    console.log('프로필 조회 완료', res);
    return res;
  } catch (error) {
    console.error('프로필 조회 오류:', error);
    throw error;
  }
};

export const putProfileInfo = async (data) => {
  try {
    const res = await axios.put(`${baseURL}/api/mypage/profile`, data, {
      withCredentials: true
    });
    console.log('프로필 수정 완료', res);
    return res;
  } catch (error) {
    console.error('프로필 수정 오류:', error);
    throw error;
  }
};

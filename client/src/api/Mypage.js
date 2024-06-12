const baseURL = 'http://localhost:3000';
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

export const getMyPosts = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/mypage/myPosts`, {
      withCredentials: true
    });
    console.log('내가 쓴 글 조회 완료', res);
    return res;
  } catch (error) {
    console.error('내가 쓴 글 조회 오류:', error);
    throw error;
  }
};

export const getMyComments = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/mypage/myComments`, {
      withCredentials: true
    });
    console.log('내가 쓴 댓글 조회 완료', res);
    return res;
  } catch (error) {
    console.error('내가 쓴 댓글 조회 오류:', error);
    throw error;
  }
};

export const getMyFavoriteLibraries = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/mypage/favoriteLibrariesList`, {
      withCredentials: true
    });
    console.log('즐겨찾기 도서관 조회 완료', res);
    return res;
  } catch (error) {
    console.error('즐겨찾기 도서관 조회 오류:', error);
    throw error;
  }
};

export const getMyReviews = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/mypage/myReviews`, {
      withCredentials: true
    });
    console.log('내가 쓴 리뷰 조회 완료', res);
    return res;
  } catch (error) {
    console.error('내가 쓴 리뷰 조회 오류:', error);
    throw error;
  }
};

export const putProfileInfo = async (data) => {
  try {
    const res = await axios.put(`${baseURL}/api/mypage/profile`, data, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('프로필 수정 완료', res);
    return res;
  } catch (error) {
    console.error('프로필 수정 오류:', error);
    throw error;
  }
};

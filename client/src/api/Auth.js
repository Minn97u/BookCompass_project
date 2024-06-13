const baseURL = 'http://localhost:3000';
import axios from 'axios';

export const postLogin = async (data) => {
  try {
    const res = await axios.post(`${baseURL}/api/login`, data, {
      withCredentials: true
    });
    console.log('로그인 완료', res);
    return res;
  } catch (error) {
    console.error('로그인 오류:', error);
    throw error;
  }
};

export const getLoginStatus = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/status`, {
      withCredentials: true
    });
    console.log('로그인 상태 확인', res);
    return res;
  } catch (error) {
    console.error('로그인 상태 확인 오류:', error);
    throw error;
  }
};

export const getGoogleLogin = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/google`, {
      withCredentials: true
    });
    console.log('구글 로그인 완료', res);
    return res;
  } catch (error) {
    console.error('구글 로그인 오류:', error);
    throw error;
  }
};

export const postSignup = async (data) => {
  try {
    const res = await axios.post(`${baseURL}/api/register`, data, {
      withCredentials: true
    });
    console.log('회원가입 완료', res);
    return res;
  } catch (error) {
    console.error('회원가입 오류:', error);
    throw error;
  }
};

export const getGoogleSignup = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/google/callback`, {
      withCredentials: true
    });
    console.log('구글 회원가입 완료', res);
    return res;
  } catch (error) {
    console.error('구글 회원가입 오류:', error);
    throw error;
  }
};

export const getLogout = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/logout`, {
      withCredentials: true
    });
    console.log('로그아웃 완료', res);
    return res;
  } catch (error) {
    console.error('로그아웃 오류:', error);
    throw error;
  }
};

export const postFindEmail = async (data) => {
  try {
    const res = await axios.post(`${baseURL}/api/find-email`, data, {
      withCredentials: true
    });
    console.log('이메일 찾기 완료', res);
    return res;
  } catch (error) {
    console.error('이메일 찾기 오류:', error);
    throw error;
  }
};

export const postFindPassword = async (data) => {
  try {
    const res = await axios.post(`${baseURL}/api/reset-password`, data, {
      withCredentials: true
    });
    console.log('비밀번호 찾기 완료', res);
    return res;
  } catch (error) {
    console.error('비밀번호 찾기 오류:', error);
    throw error;
  }
};

export const postChangePassword = async (data) => {
  try {
    const res = await axios.post(`${baseURL}/api/change-password`, data, {
      withCredentials: true
    });
    console.log('비밀번호 변경 완료', res);
    return res;
  } catch (error) {
    console.error('비밀번호 변경 오류:', error);
    throw error;
  }
};

export const getUserInfo = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/additional-info`, {
      withCredentials: true
    });
    console.log('유저 정보 조회 완료', res);
    return res;
  } catch (error) {
    console.error('유저 정보 조회 오류:', error);
    throw error;
  }
};

export const postUserInfo = async (data) => {
  try {
    const res = await axios.post(`${baseURL}/api/additional-info`, data, {
      withCredentials: true
    });
    console.log('유저 정보 수정 완료', res);
    return res;
  } catch (error) {
    console.error('유저 정보 수정 오류:', error);
    throw error;
  }
};

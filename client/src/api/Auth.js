import axios from './index';

export const postLogin = (data) => {
  return axios.post('/api/login', data);
};

export const getLoginStatus = () => {
  return axios.get('/api/status');
};

export const getGoogleLogin = () => {
  window.location.href = 'http://localhost:3000/api/google';
};

export const postSignup = (data) => {
  return axios.post('/api/register', data);
};

export const getLogout = () => {
  return axios.get('/api/logout');
};

export const postFindEmail = (data) => {
  return axios.post('/api/find-email', data);
};

export const postFindPassword = (data) => {
  return axios.post('/api/reset-password', data);
};

export const postChangePassword = (data) => {
  return axios.post('/api/change-password', data);
};

export const getUserInfo = () => {
  return axios.get('/api/additional-info');
};

export const postUserInfo = (data) => {
  return axios.post('/api/additional-info', data);
};

import axios from './index';

export const getProfileInfo = () => {
  return axios.get('/api/mypage/profile');
};

export const getMyPosts = () => {
  return axios.get('/api/mypage/myPosts');
};

export const deleteMyPost = (id) => {
  return axios.delete(`/api/mypage/myPosts/${id}`);
};

export const getMyComments = () => {
  return axios.get('/api/mypage/myComments');
};

export const deleteMyComment = (id) => {
  return axios.delete(`/api/mypage/myComments/${id}`);
};

export const getMyFavoriteLibraries = () => {
  return axios.get('/api/mypage/favoriteLibrariesList');
};

export const getMyReviews = () => {
  return axios.get('/api/mypage/myReviews');
};

export const putProfileInfo = async (data) => {
  return axios.put('/api/mypage/profile', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
export const deleteMyReview = async (id) => {
  await axios.delete(`/api/mypage/myReviews/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

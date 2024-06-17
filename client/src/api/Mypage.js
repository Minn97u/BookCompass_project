import axios from './index';

export const getProfileInfo = () => {
  return axios.get('/api/mypage/profile');
};

export const putProfileInfo = async (data) => {
  return axios.put('/api/mypage/profile', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
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

export const deleteMyComments = (id) => {
  return axios.delete(`/api/mypage/myComments/${id}`);
};

export const getMyFavoriteLibraries = () => {
  return axios.get('/api/mypage/favoriteLibrariesList');
};

export const deleteMyFavoriteLibraries = (data) => {
  return axios.delete('/api/mypage/favoriteLibraries', {
    data: { libraryId: data }
  });
};

export const getMyFavoriteParksList = () => {
  return axios.get('/api/mypage/favoriteParksList');
};

export const deleteMyFavoriteParksList = (data) => {
  return axios.delete('/api/mypage/favoriteLibraries', {
    data: { parkId: data }
  });
};

export const getMyReviews = () => {
  return axios.get('/api/mypage/myReviews');
};

export const deleteMyReviews = (id) => {
  return axios.delete(`/api/mypage/myReviews/${id}`);
};

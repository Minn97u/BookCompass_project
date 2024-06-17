import axios from './index';

export const getLibraryAvgRating = (id) => {
  return axios.get(`/api/libraries/${id}`);
};

export const getParkAvgRating = (id) => {
  return axios.get(`/api/parks/${id}`);
};

export const getReviews = (placeId) => {
  return axios.get(`/api/reviews/${placeId}`);
};

export const editReview = (reviewId, rating, comment) => {
  return axios.put(`/api/reviews/${reviewId}`, {
    rating,
    comment
  });
};

export const addLibraryFavorite = (libraryId) => {
  return axios.post('/api/favoriteLibraries', { libraryId });
};

export const deleteLibraryFavorite = (libraryId) => {
  return axios.delete(`/api/mypage/favoriteLibraries`, {
    params: { libraryId }
  });
};

export const addParkFavorite = (parkId) => {
  return axios.get('/api/favoriteParks', { parkId });
};

export const deleteParkFavorite = (parkId) => {
  return axios.delete(`/api/mypage/favoriteParks`, {
    params: { parkId }
  });
};

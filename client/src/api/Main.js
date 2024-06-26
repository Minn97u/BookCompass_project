import axios from './index';

export const getLibraryPings = () => {
  return axios
    .get('/api/libraries')
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error fetching libraries:', error);
      throw error;
    });
};

export const getParkPings = () => {
  return axios
    .get('/api/parks')
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error fetching parks:', error);
      throw error;
    });
};

export const getLibraryAvgRating = async (id) => {
  try {
    const response = await axios.get(`/api/libraries/${id}`);
    return response.data.averageRating || 0;
  } catch (error) {
    console.error('평균 평점을 가져오는 중 오류 발생:', error);
    throw error;
  }
};

export const getDustData = () => {
  return axios
    .get('/api/dust')
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error fetching dust data:', error);
      throw error;
    });
};

export const getParkAvgRating = async (id) => {
  try {
    const response = await axios.get(`/api/parks/${id}`);
    return response.data.averageRating || 0;
  } catch (error) {
    console.error('평균 평점을 가져오는 중 오류 발생:', error);
    throw error;
  }
};

export const getLibraryFav = async (userId) => {
  try {
    const response = await axios.get('/api/mypage/favoriteLibrariesList', {
      params: { userId }
    });
    return response.data;
  } catch (error) {
    console.error('도서관 즐겨찾기 목록을 가져오는 중 오류 발생:', error);
    throw error;
  }
};

export const getParkFav = async (userId) => {
  try {
    const response = await axios.get('/api/mypage/favoriteParksList', {
      params: { userId }
    });
    return response.data;
  } catch (error) {
    console.error('공원 즐겨찾기 목록을 가져오는 중 오류 발생:', error);
    throw error;
  }
};

export const postReview = async (
  userId,
  placeId,
  placeType,
  rating,
  comment
) => {
  try {
    const isLibrary = placeType === 'library';
    const isPark = placeType === 'park';

    const response = await axios.post(
      '/api/reviews',
      {
        userId,
        libraryId: isLibrary ? placeId : null, // libraryId는 도서관일 경우에만 설정
        parkId: isPark ? placeId : null, // parkId는 공원일 경우에만 설정
        rating,
        comment
      },
      {
        withCredentials: true
      }
    );

    return response.data; // API 응답 데이터 반환
  } catch (error) {
    console.error('리뷰 작성에 실패했습니다:', error);

    throw error; // 예외 처리: 상위 컴포넌트에서 처리할 수 있도록 예외를 throw
  }
};

export const getReviews = (placeId) => {
  return axios.get(`/api/reviews?placeId=${placeId}`);
};

export const editReview = (reviewId, rating, comment) => {
  return axios.put(`/api/reviews/${reviewId}`, {
    rating,
    comment
  });
};

export const addLibraryFavorite = (libraryId) => {
  return axios.post('/api/libraries/favoriteLibraries', { libraryId });
};

export const deleteLibraryFavorite = async (libraryId) => {
  try {
    const response = await axios.delete(`/api/mypage/favorites`, {
      data: { id: libraryId, type: 'library' }
    });
    return response;
  } catch (error) {
    console.error('Error deleting library from favorites:', error);
    throw error;
  }
};

export const addParkFavorite = (parkId) => {
  return axios.post('/api/parks/favoriteParks', { parkId });
};

export const deleteParkFavorite = async (parkId) => {
  try {
    const response = await axios.delete(`/api/mypage/favorites`, {
      data: { id: parkId, type: 'park' }
    });
    return response;
  } catch (error) {
    console.error('Error deleting park from favorites:', error);
    throw error;
  }
};

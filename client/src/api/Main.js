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
  libraryId,
  placeId,
  rating,
  comment
) => {
  try {
    const response = await axios.post(
      '/api/reviews',
      {
        userId,
        libraryId: placeId, // placeId가 libraryId로 사용되는 경우
        parkId: null, // parkId는 null이기 때문에 null로 설정
        rating,
        comment
      },
      {
        withCredentials: true
      }
    );
    console.log('리뷰가 성공적으로 작성되었습니다:', response.data);
    return response.data; // API 응답 데이터 반환
  } catch (error) {
    console.error('리뷰 작성에 실패했습니다:', error);

    // 에러 객체의 추가 정보를 출력합니다.
    console.log('에러 응답 데이터:', error.response?.data);
    console.log('에러 상태 코드:', error.response?.status);
    console.log('에러 헤더:', error.response?.headers);

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

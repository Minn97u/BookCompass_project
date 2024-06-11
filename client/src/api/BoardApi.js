const baseURL = 'http://localhost:5000';
import axios from 'axios';

export const getPosts = async (page, limit) => {
  try {
    const res = await axios.get(
      `${baseURL}/api/posts?page=${page}&limit=${limit}`
    );
    console.log('게시목록 로드 완료', res.data);
    return res.data;
  } catch (error) {
    console.error('게시물 로드 오류', error);
    throw error;
  }
};

export const viewPosts = async (shortId) => {
  try {
    const res = await axios.get(`${baseURL}/api/posts/${shortId}`);
    console.log('게시글 로드 완료', res);
    return res.data;
  } catch (error) {
    console.error('게시글 로드 오류', error);
    throw error;
  }
};

export const postPosts = async (data) => {
  try {
    const res = await axios.post(`${baseURL}/api/posts`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true
    });
    console.log('게시 완료', res);
    return res.data;
  } catch (error) {
    console.error('게시 오류', error);
    throw error;
  }
};

export const updatePosts = async (data, shortId) => {
  try {
    const res = await axios.put(`${baseURL}/api/posts/${shortId}`, data, {
      withCredentials: true
    });
    console.log('게시 완료', res);
    return res.data;
  } catch (error) {
    console.error('게시 오류', error);
    throw error;
  }
};

export const deletePosts = async (shortId) => {
  try {
    const res = await axios.delete(`${baseURL}/api/posts/${shortId}`, {
      withCredentials: true
    });
    console.log('게시 완료', res);
    return res.data;
  } catch (error) {
    console.error('게시 오류', error);
    throw error;
  }
};

export const postComments = async (data, shortId) => {
  try {
    const res = await axios.post(`${baseURL}/api/posts/${shortId}`, data, {
      withCredentials: true
    });
    console.log('게시 완료', res);
    return res.data;
  } catch (error) {
    console.error('게시 오류', error);
    throw error;
  }
};

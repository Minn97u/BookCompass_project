import axios from './index';

export const getPosts = async (page, limit, tag = '') => {
  const res = await axios.get(
    `/api/posts?page=${page}&limit=${limit}&tag=${tag}`
  );
  return res.data;
};

export const viewPosts = async (shortId) => {
  const res = await axios.get(`/api/posts/${shortId}`);
  return res.data;
};

export const postPosts = (data) => {
  return axios.post('/api/posts', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const updatePosts = (data, shortId) => {
  return axios.put(`/api/posts/${shortId}`, data);
};

export const deletePosts = (shortId) => {
  return axios.delete(`/api/posts/${shortId}`);
};

export const postComments = (data, shortId) => {
  return axios.post(`/api/posts/${shortId}/comments`, data);
};

export const deleteComments = (shortId, commentId) => {
  return axios.delete(`/api/posts/${shortId}/comments/${commentId}`);
};

export const updateComments = (shortId, commentId, updatedComment) => {
  return axios.put(
    `/api/posts/${shortId}/comments/${commentId}`,
    updatedComment
  );
};

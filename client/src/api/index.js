import Axios from 'axios';

const axios = Axios.create({
  baseURL: 'http://kdt-ai-10-team04.elicecoding.com',
  withCredentials: true
});

export default axios;

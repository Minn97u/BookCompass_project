import Axios from 'axios';

const axios = Axios.create({
  baseURL: 'http://kdt-ai-10-team04.elicecoding.com',
  // baseUPL: 'http://localhost:3000',
  withCredentials: true
});

export default axios;

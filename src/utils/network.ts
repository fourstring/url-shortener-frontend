import axios from "axios"
import config from "../config";
import {history} from "../App";

const unProtectedPath = ['/', '/books'];

const client = axios.create({
  baseURL: config.baseURL,
  withCredentials: true
});

client.interceptors.request.use(config => {
  // Due to cross domain restriction of Cookies, we use localStorage to store CSRFtoken.
  let csrfToken: string | null = localStorage.getItem('csrf_token');
  let accessToken: string | null = localStorage.getItem('access_token');
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  if(accessToken){
    config.headers['Authorization'] = accessToken;
  }
  return config;
});

client.interceptors.response.use(undefined, error => {
  if (error.status === 403) {
    if (unProtectedPath.indexOf(history.location.pathname) < 0) {
      history.push('/login', {
        from: history.location
      });
    }
  }
});

export {
  client
};
import axios from 'axios';
import { AuthResponse } from '@/types/AuthResponse';

export const API_URL = 'http://localhost:5000/api';

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
})

$api.interceptors.request.use(config => {
  const accessTokenData = localStorage.getItem('access_token') as string;
  const accessToken = JSON.parse(accessTokenData)?.value;  

  config.headers['authorization'] = `Bearer ${accessToken}`;
  return config;
})

$api.interceptors.response.use(config => {
  return config;
}, async error => {
  const originalRequest = error.config;

  if(error.response.status === 401 && error.config && !error.config._isRetry) {
    originalRequest._isRetry = true;

    try {
      const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {
        withCredentials: true,
      });

      localStorage.setItem('access_token', JSON.stringify(response.data.tokens.accessToken));
      return $api.request(originalRequest);
    } catch(e) {
      console.log(e);      
    }
  }
})

export default $api;
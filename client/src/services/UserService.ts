import { AxiosResponse } from 'axios';
import $api from '@/http';

export default class UserService {
  static async getUserData(): Promise<AxiosResponse<any>> {
    return $api.get<any>(`/getUserData`);
  }
}
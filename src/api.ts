import axios, { AxiosInstance } from 'axios';
import { BASE_URL } from './constants';

export default class Api {
  constructor(token: string) {
    this.http = axios.create({
      baseURL: BASE_URL,
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  public http: AxiosInstance;
}

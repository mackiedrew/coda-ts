import axios, { AxiosInstance } from 'axios';
import Doc from './resources/doc';

export const BASE_URL = 'https://coda.io/apis/v1';

export default class Api {
  constructor(token: string) {
    this.http = axios.create({
      baseURL: BASE_URL,
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  public http: AxiosInstance;
}

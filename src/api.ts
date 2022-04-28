import axios, { AxiosInstance } from 'axios';

export const BASE_URL = 'https://coda.io/apis/v1';

export class Api {
  public http: AxiosInstance;
  constructor(token: string) {
    this.http = axios.create({
      baseURL: BASE_URL,
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}

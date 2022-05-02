import axios, { AxiosInstance } from 'axios';

export class Api {
  public apiBaseUrl = 'https://coda.io/apis/v1';
  public http: AxiosInstance;
  constructor(token: string) {
    this.http = axios.create({
      baseURL: this.apiBaseUrl,
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}

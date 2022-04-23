import Api from './api';

export class Coda {
  constructor(token: string) {
    this.Api = new Api(token);
  }
  private Api: Api;
}

export default Coda;

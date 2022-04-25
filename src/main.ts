import Api from './api';
import Account from './resources/account';

export class Coda {
  private api: Api;
  public Account: Account;

  constructor(token: string) {
    this.api = new Api(token);
    this.Account = new Account(this.api);
  }
}

export default Coda;

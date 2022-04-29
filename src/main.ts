import { Api } from './api';
import { Account } from './resources/account';
import { Docs } from './resources/docs';
import { Link } from './resources/links';

export class Coda {
  private api: Api;
  public Account: Account;
  public Docs: Docs;
  public Link: Link;

  constructor(token: string) {
    this.api = new Api(token);
    this.Account = new Account(this.api);
    this.Docs = new Docs(this.api);
    this.Link = new Link(this.api);
  }
}

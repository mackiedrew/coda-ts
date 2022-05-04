import axios, { AxiosInstance } from 'axios';
import { WhoAmI } from './resources/account';
import { Docs } from './resources/docs';
import { Link } from './resources/links';

export class Coda {
  public static baseUrl = 'https://coda.io/apis/v1';
  private http: AxiosInstance;

  public Docs: Docs;

  constructor(token: string) {
    this.http = axios.create({
      baseURL: Coda.baseUrl,
      headers: { Authorization: `Bearer ${token}` },
    });
    this.Docs = new Docs(this.http);
  }

  /**
   * Get user info. Returns basic info about the current user.
   * https://coda.io/developers/apis/v1#tag/Account
   *
   * @returns Basic info about the current user, the token used and the workspace the user belongs to.
   */
  async whoAmI(): Promise<WhoAmI> {
    const response = await this.http.get<WhoAmI>(`/whoami`);
    return response.data;
  }

  /**
   * Given a browser link to a Coda object, attempts to find it and return metadata that can be used
   * to get more info on it.
   *
   * https://coda.io/developers/apis/v1#operation/resolveBrowserLink
   *
   * @param url The browser link to try to resolve; example: https://coda.io/d/_dAbCDeFGH/Launch-Status_sumnO
   * @param degradeGracefully By default, attempting to resolve the Coda URL of a deleted object
   * will result in an error. If this flag is set, the next-available object, all the way up to
   * the doc itself, will be resolved.
   * @returns Metadata for the resolved resource.
   */
  async resolveBrowserLink(url: string, degradeGracefully = false): Promise<Link> {
    const { data } = await this.http.get<Link>(`/resolveBrowserLink`, {
      params: {
        degradeGracefully,
        url,
      },
    });
    return data;
  }
}

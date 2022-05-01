import { Api } from './api';
import { Docs } from './resources/docs';
import { Link } from './resources/links';
import { ResourceType } from './types/resource';
import { Workspace } from './types/workspace';

export interface WhoAmI {
  name: string; // Name of the user.
  loginId: string; // Email address of the user.
  type: ResourceType.User; // The type of this resource.
  scoped: boolean; // True if the token used to make this request has restricted/scoped access to the API.
  tokenName: string; // Returns the name of the token used for this request.
  href: string; // API link to the user.
  workspace: Workspace; // Reference to a Coda workspace.
  pictureLink: string; // Browser-friendly link to the user's avatar image.
}

export class Coda {
  private api: Api;
  public Docs: Docs;
  public Link: Link;

  constructor(token: string) {
    this.api = new Api(token);
    this.Docs = new Docs(this.api);
    this.Link = new Link(this.api);
  }

  /**
   * Get user info. Returns basic info about the current user.
   * https://coda.io/developers/apis/v1#tag/Account
   *
   * @returns Basic info about the current user, the token used and the workspace the user belongs to.
   */
  async whoAmI(): Promise<WhoAmI> {
    const response = await this.api.http.get<WhoAmI>(`/whoami`);
    return response.data;
  }
}

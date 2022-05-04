import { Api } from './api';
import { Docs } from './resources/docs';
import { Resource, ResourceType } from './resources/resource';
import { Workspace } from './resources/workspace';

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

export interface ResourceLink {
  type: ResourceType.ApiLink;
  href: string;
  resource: Resource<ResourceType>;
  browserLink?: string; // Canonical browser-friendly link to the resolved resource.
}

export class Coda {
  private api: Api;
  public Docs: Docs;

  constructor(token: string) {
    this.api = new Api(token);
    this.Docs = new Docs(this.api);
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
  async resolveBrowserLink(url: string, degradeGracefully = false): Promise<ResourceLink> {
    const response = await this.api.http.get<ResourceLink>(`/resolveBrowserLink`, {
      params: {
        degradeGracefully,
        url,
      },
    });
    return response.data;
  }
}

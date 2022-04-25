import Api from '../api';
import { Resource, ResourceType } from './resource';
import { Workspace } from './workspace';

export interface WhoAmIResponse {
  name: string; // Name of the user.
  loginId: string; // Email address of the user.
  type: ResourceType.User; // The type of this resource.
  scoped: boolean; // True if the token used to make this request has restricted/scoped access to the API.
  tokenName: string; // Returns the name of the token used for this request.
  href: string; // API link to the user.
  workspace: Workspace; // Reference to a Coda workspace.
  pictureLink: string; // Browser-friendly link to the user's avatar image.
}

/**
 * An Account API interface class.
 *
 * At this time, the API exposes some limited information about your account.
 *
 * https://coda.io/developers/apis/v1#tag/Account
 */
export class Account extends Resource {
  constructor(api: Api) {
    super(api);
  }

  /**
   * Get user info. Returns basic info about the current user.
   *
   * @returns Basic info about the current user.
   */
  async whoAmI(): Promise<WhoAmIResponse> {
    const response = await this.api.http.get<WhoAmIResponse>(`/whoami`);
    return response.data;
  }
}

export default Account;

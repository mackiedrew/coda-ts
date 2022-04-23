import Api from '../api';
import { Resource } from './resource';

export interface WhoAmIResponse {
  completed: boolean;
}

/**
 * An Account API interface class.
 * https://coda.io/developers/apis/v1#tag/Account
 */
export class Account extends Resource {
  /**
   * @param apiInstance The API instance used to make the API call.
   */
  constructor(apiInstance: Api) {
    super(apiInstance);
  }

  async whoAmI(): Promise<WhoAmIResponse> {
    const response = await this.api.http.get<WhoAmIResponse>(`/whoami`);
    return response.data;
  }
}

export default Account;

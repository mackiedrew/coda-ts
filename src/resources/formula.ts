import Api from '../api';
import { Resource } from './resource';

/**
 * A Formula API interface class.
 *
 * https://coda.io/developers/apis/v1#tag/Formulas
 */
export class Formula extends Resource {
  /**
   * @param apiInstance The API instance used to make the API call.
   */
  constructor(apiInstance: Api) {
    super(apiInstance);
  }

  async list(): Promise<true> {
    return true;
  }

  async get(): Promise<true> {
    return true;
  }
}

export default Formula;

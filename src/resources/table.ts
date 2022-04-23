import Api from '../api';
import { Resource } from './resource';

/**
 * A Table API interface class.
 *
 * https://coda.io/developers/apis/v1#tag/Tables
 */
export class Table extends Resource {
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

export default Table;

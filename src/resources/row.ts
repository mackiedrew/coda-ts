import Api from '../api';
import { Resource } from './resource';

/**
 * A Row API interface class.
 *
 * https://coda.io/developers/apis/v1#tag/Rows
 */
export class Row extends Resource {
  /**
   * @param apiInstance The API instance used to make the API call.
   */
  constructor(apiInstance: Api) {
    super(apiInstance);
  }

  async list(): Promise<true> {
    return true;
  }

  async upsert(): Promise<true> {
    return true;
  }

  async deleteMany(): Promise<true> {
    return true;
  }

  async get(): Promise<true> {
    return true;
  }

  async update(): Promise<true> {
    return true;
  }

  async delete(): Promise<true> {
    return true;
  }

  async pushButton(): Promise<true> {
    return true;
  }

}

export default Row;

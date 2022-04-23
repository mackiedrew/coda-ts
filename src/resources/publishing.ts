import Api from '../api';
import { Resource } from './resource';

export interface PublishingCategoriesResponse {
  response: string[];
}

/**
 * A publishing API interface class.
 *
 * https://coda.io/developers/apis/v1#tag/Publishing
 */
export class Publishing extends Resource {
  constructor(apiInstance: Api) {
    super(apiInstance);
  }

  // TODO
  async catetories(): Promise<true> {
    return true;
  }

  // TODO
  async publish(): Promise<true> {
    return true;
  }

  // TODO
  async unpublish(): Promise<true> {
    return true;
  }
}

export default Publishing;

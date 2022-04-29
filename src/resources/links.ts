import { Api } from '../api';
import { Resource, ResourceType } from '../types/resource';

export interface ResourceLink {
  type: ResourceType.ApiLink;
  href: string;
  resource: Resource<ResourceType>;
  browserLink?: string; // Canonical browser-friendly link to the resolved resource.
}

/**
 * Given a browser link to a Coda object, attempts to find it and return metadata that can be used
 * to get more info on it.
 *
 * https://coda.io/developers/apis/v1#operation/resolveBrowserLink
 */
export class Link {
  private api: Api;
  constructor(api: Api) {
    this.api = api;
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
  async resolve(url: string, degradeGracefully = false): Promise<ResourceLink> {
    const response = await this.api.http.get<ResourceLink>(`/resolveBrowserLink`, {
      params: {
        degradeGracefully,
        url,
      },
    });
    return response.data;
  }
}

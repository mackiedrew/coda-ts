import Api from '../api';
import { ItemResponse, ResourceType } from './resource';

export interface BrowserLinkDto {
  // The browser link to try to resolve.
  url: string;
  /**
   * By default, attempting to resolve the Coda URL of a deleted object will
   * result in an error. If this flag is set, the next-available object, all
   * the way up to the doc itself, will be resolved.
   */
  degradeGracefully?: boolean;
}

export interface BrowserLinkResponse extends ItemResponse<ResourceType.ApiLink> {
  browserLink?: string; // Canonical browser-friendly link to the resolved resource.
  resource: {
    id: string;
    href: string;
    type: ResourceType;
    name: string;
  };
}

/**
 * Given a browser link to a Coda object, attempts to find it and return metadata that can be used
 * to get more info on it.
 *
 * https://coda.io/developers/apis/v1#operation/resolveBrowserLink
 */
export class BrowserLink {
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
  async resolve(url: string, degradeGracefully = false): Promise<BrowserLinkResponse> {
    const response = await this.api.http.get<BrowserLinkResponse>(`/resolveBrowserLink`, {
      params: {
        url,
        degradeGracefully,
      },
    });
    return response.data;
  }
}

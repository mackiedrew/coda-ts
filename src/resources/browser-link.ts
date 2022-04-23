import Api from '../api';
import { Resource } from './resource';
import { ItemResponse, ResourceType } from './types';

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
  browserLink: string;
  resource: ItemResponse<ResourceType.Metadata>;
}

export class BrowserLink extends Resource {
  constructor(apiInstance: Api) {
    super(apiInstance);
  }
  async resolve({ url, degradeGracefully = false }: BrowserLinkDto): Promise<BrowserLinkResponse> {
    const response = await this.api.http.get<BrowserLinkResponse>(`/resolveBrowserLink`, {
      params: {
        url,
        degradeGracefully,
      },
    });
    return response.data;
  }
}

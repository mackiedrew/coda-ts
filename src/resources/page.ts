import { Api } from '../api';
import { Icon } from '../types/icon';
import { Image } from '../types/image';
import { Mutation } from './mutation';
import { Resource, ResourceList, Pagination, ResourceType } from '../types/resource';

export interface PageRef {
  id: string; // ID of the page.
  type: ResourceType.Page; // The type of this resource.
  browserLink: string; // Browser-friendly link to the page.
  href: string; // API link to the page.
  name: string; // Name of the page.
}

export interface PageResource extends Resource<ResourceType.Page> {
  browserLink: string;
  subtitle?: string;
  icon?: Icon;
  image?: Image;
  parent?: PageResource;
  children?: PageResource[];
}

export interface PageUpdateDto {
  name?: string;
  subtitle?: string;
  iconName?: string;
  imageUrl?: string;
}

interface PageUpdateResponse {
  id: string;
  requestId: string;
}

/**
 * A Page API interface class.
 *
 * Pages in Coda offer canvases containing rich text, tables, controls, and other objects.
 * At this time, this API lets you list and access pages in a doc.
 *
 * https://coda.io/developers/apis/v1#tag/Pages
 */
export class Page {
  private api: Api;
  constructor(api: Api) {
    this.api = api;
  }

  /**
   * Returns a list of pages in a Coda doc.
   *
   * https://coda.io/developers/apis/v1#operation/listPages
   *
   * @param docId ID of the doc; example: `AbCDeFGH`
   * @param options Standard pagination options.
   * @returns List of pages.
   */
  async list(docId: string, options: Pagination = {}): Promise<ResourceList<PageResource>> {
    const response = await this.api.http.get<ResourceList<PageResource>>(`/docs/${docId}/pages`, {
      params: options,
    });
    return response.data;
  }

  /**
   * Returns details about a page.
   *
   * https://coda.io/developers/apis/v1#operation/getPage
   *
   * @param docId ID of the doc; example: `AbCDeFGH`
   * @param pageIdOrName ID or name of the page. Names are discouraged because they're easily prone
   * to being changed by users. If you're using a name, be sure to URI-encode it. If you provide a
   * name and there are multiple pages with the same name, an arbitrary one will be selected.
   * @returns Returns details about a page.
   */
  async get(docId: string, pageIdOrName: string): Promise<PageResource> {
    const response = await this.api.http.get<PageResource>(`/docs/${docId}/pages/${pageIdOrName}`);
    return response.data;
  }

  /**
   * Update properties for a page.
   *
   * https://coda.io/developers/apis/v1#operation/updatePage
   *
   * @param docId ID of the doc; example: `AbCDeFGH`
   * @param pageIdOrName ID or name of the page. Names are discouraged because they're easily prone
   * to being changed by users. If you're using a name, be sure to URI-encode it. If you provide a
   * name and there are multiple pages with the same name, an arbitrary one will be selected.
   * @returns Update properties for a page.
   */
  async update(docId: string, pageIdOrName: string): Promise<Mutation> {
    const response = await this.api.http.put<PageUpdateResponse>(
      `/docs/${docId}/pages/${pageIdOrName}`,
    );
    return new Mutation(this.api, response.data.requestId);
  }
}

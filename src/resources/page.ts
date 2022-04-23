import Api from '../api';
import { Icon } from './icon';
import { Image } from './image';
import { Mutation } from './mutation';
import { ItemResponse, ListResponse, Resource, ResourceType } from './resource';

export interface PageResponse extends ItemResponse<ResourceType.Page> {
  browserLink: string;
  subtitle?: string;
  icon?: Icon;
  image?: Image;
  parent?: PageResponse;
  children?: PageResponse[];
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
export class Page extends Resource {
  /**
   * @param apiInstance The API instance used to make the API call.
   */
  constructor(apiInstance: Api) {
    super(apiInstance);
  }

  /**
   * Returns a list of pages in a Coda doc.
   *
   * https://coda.io/developers/apis/v1#operation/listPages
   *
   * @param docId ID of the doc; example: `AbCDeFGH`
   * @param limit Maximum number of results to return in this query; default is 25; integer >= 1
   * @param pageToken An opaque token used to fetch the next page of results; example: `eyJsaW1pd`
   *
   * @returns List of pages.
   */
  async list(
    docId: string,
    limit?: number,
    pageToken?: string,
  ): Promise<ListResponse<PageResponse>> {
    const options = { limit, pageToken };
    const response = await this.api.http.get<ListResponse<PageResponse>>(`/docs/${docId}/pages`, {
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
  async get(docId: string, pageIdOrName: string): Promise<PageResponse> {
    const response = await this.api.http.get<PageResponse>(`/docs/${docId}/pages/${pageIdOrName}`);
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
    const mutation = new Mutation(this.api, response.data.requestId);
    return mutation;
  }
}

export default Page;

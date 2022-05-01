import { Api } from '../api';
import { Icon } from '../types/icon';
import { Image } from '../types/image';
import { Mutation } from './mutation';
import { Resource, ResourceType } from '../types/resource';

export interface PageRef {
  id: string; // ID of the page.
  type: ResourceType.Page; // The type of this resource.
  browserLink: string; // Browser-friendly link to the page.
  href: string; // API link to the page.
  name: string; // Name of the page.
}

export interface PageDto extends Resource<ResourceType.Page> {
  browserLink: string;
  subtitle?: string;
  icon?: Icon;
  image?: Image;
  parent?: PageDto;
  children?: PageDto[];
}

export interface PageUpdateOptions {
  name?: string;
  subtitle?: string;
  iconName?: string;
  imageUrl?: string;
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
  public docId: string;
  public type: ResourceType.Page = ResourceType.Page;
  public browserLink?: string;
  public subtitle?: string;
  public icon?: Icon;
  public image?: Image;
  public parent?: Page;
  public children?: Page[];

  constructor(api: Api, docId: string) {
    this.api = api;
    this.docId = docId;
  }

  /**
   * Update properties for a page.
   *
   * https://coda.io/developers/apis/v1#operation/updatePage
   *
   * @param pageIdOrName ID or name of the page. Names are discouraged because they're easily prone
   * to being changed by users. If you're using a name, be sure to URI-encode it. If you provide a
   * name and there are multiple pages with the same name, an arbitrary one will be selected.
   * @param options Options to update page, see docs or type for details.
   * @returns Update properties for a page.
   */
  async update(pageIdOrName: string, options: PageUpdateOptions): Promise<Mutation> {
    const response = await this.api.http.put<{ requestId: string }>(
      `/docs/${this.docId}/pages/${pageIdOrName}`,
      options,
    );
    return new Mutation(this.api, response.data.requestId);
  }
}

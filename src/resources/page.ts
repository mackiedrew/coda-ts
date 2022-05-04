import { AxiosInstance } from 'axios';
import { Icon } from './icon';
import { Image } from './image';
import { Mutation } from './mutation';
import { Resource, ResourceType } from './base';

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
  private http: AxiosInstance;

  public id: string;
  public docId: string;
  public type: ResourceType.Page = ResourceType.Page;

  public browserLink?: string;
  public subtitle?: string;
  public icon?: Icon;
  public image?: Image;
  public parent?: Page;
  public children?: Page[];

  constructor(http: AxiosInstance, docId: string, pageIdOrName: string) {
    this.http = http;
    this.docId = docId;
    this.id = pageIdOrName;
  }

  /**
   * Returns details about a page.
   *
   * https://coda.io/developers/apis/v1#operation/getPage
   *
   * @param pageIdOrName ID or name of the page. Names are discouraged because they're easily prone
   * to being changed by users. If you're using a name, be sure to URI-encode it. If you provide a
   * name and there are multiple pages with the same name, an arbitrary one will be selected.
   * @returns Returns details about a page.
   */
  async get(pageIdOrName: string = this.id): Promise<Page> {
    const response = await this.http.get<PageDto>(`/docs/${this.docId}/pages/${pageIdOrName}`);
    return this.set(response.data);
  }

  set(page: Page | PageDto): Page {
    this.browserLink = page.browserLink;
    this.subtitle = page.subtitle;
    this.icon = page.icon;
    this.image = page.image;
    if (page.parent) {
      this.parent = new Page(this.http, this.docId, page.id).set(page.parent);
    }
    if (page.children) {
      this.children = page.children.map((child) =>
        new Page(this.http, this.docId, child.id).set(child),
      );
    }

    return this;
  }

  async refresh(): Promise<Page | void> {
    const page = await this.get();
    if (page) this.set(page);
    return page;
  }

  /**
   * Update properties for a page.
   *
   * https://coda.io/developers/apis/v1#operation/updatePage
   *
   * @param options Options to update page, see docs or type for details.
   * @returns Update properties for a page.
   */
  async update(options: PageUpdateOptions): Promise<Mutation> {
    const response = await this.http.put<{ requestId: string }>(
      `/docs/${this.docId}/pages/${this.id}`,
      options,
    );
    return new Mutation(this.http, response.data.requestId);
  }
}

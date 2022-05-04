import { AxiosInstance } from 'axios';
import { ResourceList, Pagination } from './base';
import { Page, PageDto } from './page';

/**
 * A Page API interface class.
 *
 * Pages in Coda offer canvases containing rich text, tables, controls, and other objects.
 * At this time, this API lets you list and access pages in a doc.
 *
 * https://coda.io/developers/apis/v1#tag/Pages
 */
export class Pages {
  private readonly http: AxiosInstance;
  private readonly docId: string;

  constructor(http: AxiosInstance, docId: string) {
    this.http = http;
    this.docId = docId;
  }

  /**
   * Returns a list of pages in a Coda doc.
   *
   * https://coda.io/developers/apis/v1#operation/listPages
   *
   * @param options Standard pagination options.
   * @returns List of pages.
   */
  public async list(options: Pagination = {}): Promise<ResourceList<Page>> {
    const { data } = await this.http.get<ResourceList<PageDto>>(`/docs/${this.docId}/pages`, {
      params: options,
    });

    return {
      ...data,
      items: data.items.map((page) => new Page(this.http, this.docId, page.id).set(page)),
    };
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
  public async get(pageIdOrName: string): Promise<Page> {
    const page = new Page(this.http, this.docId, pageIdOrName);
    return await page.get();
  }
}

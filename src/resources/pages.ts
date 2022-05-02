import { Api } from '../api';
import { ResourceList, Pagination } from '../types/resource';
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
  private api: Api;
  private docId: string;
  constructor(api: Api, docId: string) {
    this.api = api;
    this.docId = docId;
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
  async list(docId: string, options: Pagination = {}): Promise<ResourceList<Page>> {
    const response = await this.api.http.get<ResourceList<PageDto>>(`/docs/${docId}/pages`, {
      params: options,
    });

    return {
      ...response.data,
      items: response.data.items.map((page) => new Page(this.api, this.docId, page.id).set(page)),
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
  async get(pageIdOrName: string): Promise<Page | void> {
    const page = new Page(this.api, this.docId, pageIdOrName);
    await page.refresh();
    return page;
  }
}

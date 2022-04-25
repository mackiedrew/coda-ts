import Api from '../api';
import Mutation from './mutation';

export type Categories = string[];

export enum DocPublishMode {
  View = 'view',
  Play = 'play',
  Edit = 'edit',
}

export interface PublishOptions {
  slug: string; // Slug for the published doc.
  discoverable: boolean; // If true, indicates that the doc is discoverable.
  earnCredit: boolean; // If true, new users may be required to sign in to view content within this document.
  categoryNames: Categories; // The names of categories to apply to the document.
  mode: DocPublishMode;
}

/**
 * A publishing API interface class. Coda docs can be published publicly and associated
 * with categories to help the world discover them. This API lets you manage the
 * publishing settings of your docs.
 *
 * https://coda.io/developers/apis/v1#tag/Publishing
 */
export class Publishing {
  private api: Api;
  constructor(api: Api) {
    this.api = api;
  }

  /**
   * Gets all available doc categories.
   *
   * https://coda.io/developers/apis/v1#operation/listCategories
   *
   * @returns All available doc categories.
   */
  async catetories(): Promise<Categories> {
    const response = await this.api.http.get<Categories>('/categories');
    return response.data;
  }

  /**
   * Update publish settings for a doc.
   *
   * https://coda.io/developers/apis/v1#operation/publishDoc
   *
   * @param docId ID of the doc; example: `AbCDeFGH`
   * @param options Options for query. See type or docs for details.
   * @returns Returns mutation that can provide completion status.
   */
  async publish(docId: string, options: PublishOptions): Promise<Mutation> {
    const response = await this.api.http.put<{ requestId: string }>(
      `/docs/${docId}/publish`,
      options,
    );
    return new Mutation(this.api, response.data.requestId);
  }

  /**
   * Unpublishes a doc.
   *
   * https://coda.io/developers/apis/v1#operation/unpublishDoc
   *
   * @param docId ID of the doc; example: `AbCDeFGH`
   * @returns Returns true if document unpublished.
   */
  async unpublish(docId: string): Promise<true> {
    await this.api.http.delete<any>(`/docs/${docId}/publish`);
    return true;
  }
}

export default Publishing;

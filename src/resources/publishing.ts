import Api from '../api';
import Mutation from './mutation';

export interface Published {
  description: string;
  browserLink: string;
  imageLink: string;
  discoverable: boolean;
  earnCredit: boolean;
  mode: boolean;
  categories: string[];
}

export enum DocPublishMode {
  View = 'view',
  Play = 'play',
  Edit = 'edit',
}

export interface PublishOptions {
  slug: string; // Slug for the published doc.
  discoverable: boolean; // If true, indicates that the doc is discoverable.
  earnCredit: boolean; // If true, new users may be required to sign in to view content within this document.
  categoryNames: string[]; // The names of categories to apply to the document.
  mode: DocPublishMode;
}

/**
 * A publishing API interface class. Coda docs can be published publicly and associated
 * with categories to help the world discover them. This API lets you manage the
 * publishing settings of your docs.
 *
 * https://coda.io/developers/apis/v1#tag/Publishing
 */
export class Publish {
  private api: Api;
  private id: string;
  constructor(api: Api, docId: string) {
    this.api = api;
    this.id = docId;
  }

  /**
   * Update publish settings for a doc.
   *
   * https://coda.io/developers/apis/v1#operation/publishDoc
   *
   * @param options Options for query. See type or docs for details.
   * @returns Returns mutation that can provide completion status.
   */
  async publish(options: PublishOptions): Promise<Mutation> {
    const response = await this.api.http.put<{ requestId: string }>(
      `/docs/${this.id}/publish`,
      options,
    );
    return new Mutation(this.api, response.data.requestId);
  }

  /**
   * Unpublishes a doc.
   *
   * https://coda.io/developers/apis/v1#operation/unpublishDoc
   *
   * @returns Returns true if document unpublished.
   */
  async unpublish(): Promise<true> {
    await this.api.http.delete<any>(`/docs/${this.id}/publish`);
    return true;
  }
}

export default Publish;

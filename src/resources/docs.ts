import { Api } from '../api';
import { Doc, DocResponse } from './doc';
import { ResourceList, Pagination } from '../types/resource';

export type Category = { name: string };

export interface DocCreateOptions {
  title?: string; // Title of the new doc. Defaults to 'Untitled'.
  sourceDoc?: string; // An optional doc ID from which to create a copy.
  timezone?: string; // The timezone to use for the newly created doc.
  folderId?: string; // The ID of the folder within which to create this doc. Defaults to your "My docs" folder in the oldest workspace you joined
}

export interface DocsListOptions extends Pagination {
  isOwner?: boolean; // Show only docs owned by the user.
  isPublisher?: boolean; // Show only published docs.
  query?: string; // Search term used to filter down resutls.
  sourceDoc?: string; // Show only docs copied from the specified doc ID.
  isStarred?: boolean; // If true, returns docs that are starred. If false, returns docs that are not starred.
  inGallery?: boolean; // Show only docs visible within the gallery.
  workspaceId?: string; // Show only docs belonging to the given workspace.
  folderid?: string; // Show only docs belonging to the given folder.
}

export type DocsCountOptions = {
  isPublished?: boolean; // Limit results to only published items.
  isOwner?: boolean; // Show only docs owned by the user.
  workspaceId?: string; // Filters docs belonging to the given workspace.
};

/**
 * A Docs API interface singleton class.
 * This is meant to deal with any Docs collectively rather than as individual Docs.
 *
 * Coda docs are foundational, top-level collaborative projects that contain pages.
 * The API lets you list and search your docs to obtain basic metadata like titles
 * and ownership information.
 *
 * https://coda.io/developers/apis/v1#tag/Docs
 */
export class Docs {
  private api: Api;
  constructor(api: Api) {
    this.api = api;
  }

  /**
   * Creates a new Coda doc, optionally copying an existing doc. Note that creating a
   * doc requires you to be a Doc Maker in the applicable workspace(or be auto-promoted
   * to one).
   *
   * https://coda.io/developers/apis/v1#operation/createDoc
   *
   * @param docData Doc creation parameters. (see docs or type for details)
   * @returns Information about the created Doc.
   */
  async create(docData: DocCreateOptions): Promise<Doc> {
    const response = await this.api.http.post<DocResponse>(`/docs`, docData);
    return new Doc(this.api, response.data);
  }

  /**
   * Returns metadata for the specified doc.
   *
   * https://coda.io/developers/apis/v1#operation/getDoc
   *
   * @param docId ID of the doc; example: `AbCDeFGH`
   * @returns Returns metadata for the specified doc.
   */
  async get(docId: string): Promise<Doc> {
    const response = await this.api.http.get<DocResponse>(`/docs/${docId}`);
    return new Doc(this.api, response.data);
  }

  /**
   * Returns a list of Coda docs accessible by the user. These are returned in the
   * same order as on the docs page: reverse chronological by the latest event relevant
   * to the user (last viewed, edited, or shared).
   *
   * https://coda.io/developers/apis/v1#operation/listDocs
   *
   * @param options Query parameters to support search and pagination. (see docs or type for details)
   * @returns Returns a list of Coda docs accessible by the user.
   */
  async list(options: DocsListOptions = {}): Promise<ResourceList<Doc>> {
    const response = await this.api.http.get<ResourceList<DocResponse>>('/docs', {
      params: options,
    });

    return {
      ...response.data,
      items: response.data.items.map((item) => new Doc(this.api, item)),
    };
  }

  /**
   * Get number of docs for the user matching the query.
   * UNIMPLEMENTED DUE TO CODA BUG
   *
   * https://coda.io/developers/apis/v1#operation/getDocsCount
   *
   * @param options Doc count options. (see docs or type for details)
   * @returns Returns the number of docs for the authenticated user matching the query.
   */
  // async count(options: CountDocsOptions = {}): Promise<number> {
  //   const response = await this.api.http.get<{ count: number }>('/docs/count', { params: options });
  //   return response.data.count;
  // }

  /**
   * Gets all available doc categories.
   *
   * https://coda.io/developers/apis/v1#operation/listCategories
   *
   * @returns All available doc categories.
   */
  async catetories(): Promise<string[]> {
    const response = await this.api.http.get<{ items: Category[] }>('/categories');
    return response.data.items.map((category: Category) => category.name);
  }
}

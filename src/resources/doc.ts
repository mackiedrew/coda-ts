import { Api } from '../api';
import { Folder } from './folder';
import { Icon } from './icon';
import { Permissions } from './permissions';
import { PublishInfo, PublishOptions } from './publishing';
import { ResourceType, Resource } from './resource';
import { Workspace } from './workspace';
import { Controls } from './controls';
import { Mutation } from './mutation';
import { Tables } from './tables';
import { Pages } from './pages';
import { Formulas } from './formulas';

export interface ShareMetadata {
  canShare: boolean; // When true, the user of the api can share
  canShareWithOrg: boolean; // When true, the user of the api can share with the org
  canCopy: boolean; // When true, the user of the api can copy the doc
}

export interface DocSize {
  totalRowCount: number;
  tableAndViewCount: number;
  pageCount: number;
  overApiSizeLimit: boolean;
}

export interface DocRef {
  id: string;
  type: ResourceType.Doc;
  href: string;
  browserLink: string;
}

export interface DoctDto extends Resource<ResourceType.Doc> {
  browserLink: string;
  owner: string;
  ownerName: string;
  createdAt: string;
  updatedAt: string;
  workspace: Workspace;
  folder: Folder;
  icon?: Icon;
  docSize?: DocSize;
  sourceDoc?: DocRef;
  published?: PublishInfo;
}

/**
 * A Doc API interface class.
 *
 * Coda docs are foundational, top-level collaborative projects that contain pages.
 * The API lets you list and search your docs to obtain basic metadata like titles
 * and ownership information.
 *
 * https://coda.io/developers/apis/v1#tag/Docs
 */
export class Doc {
  private api: Api;

  static type = ResourceType.Doc;

  public id: string;
  public name?: string;
  public href?: string;

  public browserLink?: string;
  public owner?: string;
  public ownerName?: string;
  public createdAt?: string;
  public updatedAt?: string;
  public workspace?: Workspace;
  public folder?: Folder;
  public icon?: Icon;
  public docSize?: DocSize;
  public sourceDoc?: DocRef;
  public published?: PublishInfo;

  public Permissions: Permissions;
  public Formulas: Formulas;
  public Controls: Controls;
  public Tables: Tables;
  public Pages: Pages;

  constructor(api: Api, id: string) {
    this.api = api;
    this.id = id;

    this.Controls = new Controls(api, id);
    this.Formulas = new Formulas(api, id);
    this.Tables = new Tables(api, id);
    this.Permissions = new Permissions(api, id);
    this.Pages = new Pages(api, id);
  }

  set(doc: Doc | DoctDto) {
    this.name = doc.name;
    this.href = doc.href;
    this.browserLink = doc.browserLink;
    this.owner = doc.owner;
    this.ownerName = doc.ownerName;
    this.createdAt = doc.createdAt;
    this.updatedAt = doc.updatedAt;
    this.workspace = doc.workspace;
    this.folder = doc.folder;
    this.icon = doc.icon;
    this.docSize = doc.docSize;
    this.sourceDoc = doc.sourceDoc;
    this.published = doc.published;
    return this;
  }

  /**
   * Returns metadata for the specified doc.
   *
   * https://coda.io/developers/apis/v1#operation/getDoc
   *
   * @param docId ID of the doc; example: `AbCDeFGH`
   * @returns Returns metadata for the specified doc.
   */
  async get(docId: string = this.id): Promise<Doc | void> {
    const response = await this.api.http.get<DoctDto>(`/docs/${docId}`);
    return this.set(response.data);
  }

  async refresh(): Promise<Doc | void> {
    const doc = await this.get();
    if (doc) this.set(doc);
    return doc;
  }

  /**
   * Deletes a doc.
   *
   * https://coda.io/developers/apis/v1#operation/deleteDoc
   *
   * @returns Returns true if doc was deleted.
   */
  async delete(): Promise<boolean> {
    await this.api.http.delete(`/docs/${this.id}`);
    return true;
  }

  /**
   * Returns metadata associated with sharing for this Coda doc.
   *
   * https://coda.io/developers/apis/v1#operation/getSharingMetadata
   *
   * @returns Metadata associated with sharing for this Coda doc.
   */
  async getShareMetadata(): Promise<ShareMetadata> {
    const response = await this.api.http.get<ShareMetadata>(`/docs/${this.id}/acl/metadata`);
    return response.data;
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
  async unpublish(): Promise<void> {
    await this.api.http.delete<any>(`/docs/${this.id}/publish`);
  }
}

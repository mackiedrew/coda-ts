import { Api } from '../api';
import { Folder } from '../types/folder';
import { Icon } from '../types/icon';
import { Permissions } from './permission';
import { PublishInfo } from './publish';
import { ResourceType, Resource } from '../types/resource';
import { Workspace } from '../types/workspace';
import { Automation } from './automation';

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
  public name: string;
  public href: string;

  public browserLink: string;
  public owner: string;
  public ownerName: string;
  public createdAt: string;
  public updatedAt: string;
  public workspace: Workspace;
  public folder: Folder;
  public icon?: Icon;
  public docSize?: DocSize;
  public sourceDoc?: DocRef;
  public published?: PublishInfo;

  public Automation: Automation;
  public Permissions: Permissions;

  constructor(api: Api, doc: DoctDto) {
    this.api = api;

    this.id = doc.id;
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

    this.Automation = new Automation(api, doc.id);
    this.Permissions = new Permissions(api, doc.id);
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
  async shareMetadata(): Promise<ShareMetadata> {
    const response = await this.api.http.get<ShareMetadata>(`/docs/${this.id}/acl/metadata`);
    return response.data;
  }
}

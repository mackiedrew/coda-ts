import Api from '../api';
import { Folder } from './folder';
import { Icon } from './icon';
import { Resource, ListResponse, ResourceType, ItemResponse } from './resource';
import { Workspace } from './workspace';

export interface CreateDocDto {
  title?: string; // Title of the new doc. Defaults to 'Untitled'.
  sourceDoc?: string; // An optional doc ID from which to create a copy.
  timezone?: string; // The timezone to use for the newly created doc.
  folderId?: string; // The ID of the folder within which to create this doc. Defaults to your "My docs" folder in the oldest workspace you joined
}

export interface CountDocsDto {
  isPublished?: boolean; // Limit results to only published items.
  isOwner?: boolean; // Show only docs owned by the user.
  workspaceId?: string; // Filters docs belonging to the given workspace.
}

export enum AccessType {
  Readonly = 'readonly',
  Write = 'write',
  Comment = 'comment',
  None = 'none',
}

export enum PrincipalType {
  Email = 'email',
  Domain = 'domain',
  Anyone = 'anyone',
}

export interface PrincipalEmail {
  email: string;
  type: PrincipalType.Email;
}

export interface PrincipalDomain {
  domain: string;
  type: PrincipalType.Domain;
}

export interface PrincipalAnyone {
  type: PrincipalType.Anyone;
}

export type Principal = PrincipalEmail | PrincipalDomain | PrincipalAnyone;

export interface AddPermissionDto {
  access: AccessType;
  principal: Principal;
  supressEmail?: boolean;
}

export interface PermissionResponse {
  principal: Principal;
  id: string;
  access: AccessType;
}

export interface MetadataResponse {
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

export interface DocResource extends ItemResponse<ResourceType.Doc> {
  browserLink: string;
  icon: Icon;
  name: string;
  owner: string;
  ownerName: string;
  docSize: DocSize;
  sourceDoc: DocRef;
  createdAt: string;
  updatedAt: string;
  published: {
    description: string;
    browserLink: string;
    imageLink: string;
    discoverable: boolean;
    earnCredit: boolean;
    mode: boolean;
    categories: string[];
  };
  folder: Folder;
  workspace: Workspace;
  workspaceId: string;
  folderId: string;
}

// https://coda.io/developers/apis/v1#operation/listDocs
export interface ListDocOptions {
  isOwner?: boolean; // Show only docs owned by the user.
  isPublisher?: boolean; // Show only published docs.
  query?: string; // Search term used to filter down resutls.
  sourceDoc?: string; // Show only docs copied from the specified doc ID.
  isStarred?: boolean; // If true, returns docs that are starred. If false, returns docs that are not starred.
  inGallery?: boolean; // Show only docs visible within the gallery.
  workspaceId?: string; // Show only docs belonging to the given workspace.
  folderid?: string; // Show only docs belonging to the given folder.
  limit?: number; // Maximum number of results to return in this query. (default=25)
  pageToken?: string; // An opaque token used to fetch the next page of results.
}

export type ListDocResponse = ListResponse<DocResource>;

/**
 * A Doc API interface class.
 * 
 * Coda docs are foundational, top-level collaborative projects that contain pages.
 * The API lets you list and search your docs to obtain basic metadata like titles
 * and ownership information.

 * https://coda.io/developers/apis/v1#tag/Docs
 */
export class Doc extends Resource {
  constructor(apiInstance: Api) {
    super(apiInstance);
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
  async list(options: ListDocOptions): Promise<ListDocResponse> {
    const response = await this.api.http.get<ListDocResponse>(`/docs`, { params: options });
    return response.data;
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
  async create(docData: CreateDocDto): Promise<DocResource> {
    const response = await this.api.http.post<DocResource>(`/docs`, docData);
    return response.data;
  }

  /**
   * Get number of docs for the user matching the query.
   *
   * https://coda.io/developers/apis/v1#operation/getDocsCount
   *
   * @param options Doc count options. (see docs or type for details)
   * @returns Returns the number of docs for the authenticated user matching the query.
   */
  async count(options: CountDocsDto): Promise<number> {
    const response = await this.api.http.get<{ count: number }>('/docs/count', { params: options });
    return response.data.count;
  }

  /**
   * Returns metadata for the specified doc.
   *
   * https://coda.io/developers/apis/v1#operation/getDoc
   *
   * @param docId ID of the doc; example: `AbCDeFGH`
   * @returns Returns metadata for the specified doc.
   */
  async get(docId: string): Promise<DocResource> {
    const response = await this.api.http.get<DocResource>(`/docs/${docId}`);
    return response.data;
  }

  /**
   * Deletes a doc.
   *
   * https://coda.io/developers/apis/v1#operation/deleteDoc
   *
   * @param docId ID of the doc; example: `AbCDeFGH`
   * @returns Returns true if doc was deleted.
   */
  async delete(docId: string): Promise<boolean> {
    await this.api.http.delete(`/docs/${docId}`);
    return true;
  }

  /**
   * Returns metadata associated with sharing for this Coda doc.
   *
   * https://coda.io/developers/apis/v1#operation/getSharingMetadata
   *
   * @param docId ID of the doc; example: `AbCDeFGH`
   * @returns Metadata associated with sharing for this Coda doc.
   */
  async shareMetadata(docId: string): Promise<MetadataResponse> {
    const response = await this.api.http.get<MetadataResponse>(`/docs/${docId}/acl/metadata`);
    return response.data;
  }

  /**
   * Returns a list of permissions for this Coda doc.
   *
   * https://coda.io/developers/apis/v1#operation/getPermissions
   *
   * @param docId ID of the doc; example: `AbCDeFGH`
   * @param limit Maximum number of results to return in this query; example: `10`; default: `25`
   * @param pageToken An opaque token used to fetch the next page of results; example: `eyJsaW1pd`
   * @returns Returns a list of permissions for this Coda doc.
   */
  async listPermissions(
    docId: string,
    limit: number,
    pageToken: string,
  ): Promise<ListResponse<PermissionResponse>> {
    const response = await this.api.http.get<ListResponse<PermissionResponse>>(
      `/docs/${docId}/acl/permissions`,
      {
        params: { limit, pageToken },
      },
    );
    return response.data;
  }

  /**
   * Adds a new permission to the doc.
   *
   * https://coda.io/developers/apis/v1#operation/addPermission
   *
   * @param docId ID of the doc; example: `AbCDeFGH`
   * @param options Parameters for adding the new permission. (see docs or type for details)
   * @returns Returns true if permission was added.
   */
  async addPermission(docId: string, options: AddPermissionDto): Promise<boolean> {
    await this.api.http.post<any>(`/docs/${docId}/acl/permissions`, options);
    return true;
  }

  /**
   * Deletes an existing permission.
   *
   * https://coda.io/developers/apis/v1#operation/deletePermission
   *
   * @param docId ID of the doc; example: `AbCDeFGH`
   * @param permissionId ID of a permission on a doc; example: `AbCDeFGH`
   * @returns Returns true if permission was deleted.
   */
  async deletePermission(docId: string, permissionId: string): Promise<boolean> {
    await this.api.http.delete(`/docs/${docId}/acl/permissions/${permissionId}`);
    return true;
  }
}

export default Doc;

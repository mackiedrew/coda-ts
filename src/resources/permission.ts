import Api from '../api';
import { ListResponse, Pagination } from './resource';

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

export interface AddPermssionOptions {
  access: AccessType;
  principal: Principal;
  supressEmail?: boolean;
}

export interface PermissionResponse {
  principal: Principal;
  id: string;
  access: AccessType;
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
export class Permissions {
  private api: Api;
  private id: string;

  constructor(api: Api, docId: string) {
    this.api = api;
    this.id = docId;
  }

  /**
   * Returns a list of permissions for this Coda doc.
   *
   * https://coda.io/developers/apis/v1#operation/getPermissions
   *
   * @param options Standard pagination options.
   * @returns Returns a list of permissions for this Coda doc.
   */
  async list(options: Pagination = {}): Promise<ListResponse<PermissionResponse>> {
    const response = await this.api.http.get<ListResponse<PermissionResponse>>(
      `/docs/${this.id}/acl/permissions`,
      {
        params: options,
      },
    );
    return response.data;
  }

  /**
   * Adds a new permission to the doc.
   *
   * https://coda.io/developers/apis/v1#operation/addPermission
   *
   * @param options Parameters for adding the new permission. (see docs or type for details)
   * @returns Returns true if permission was added.
   */
  async add(options: AddPermssionOptions): Promise<boolean> {
    await this.api.http.post<any>(`/docs/${this.id}/acl/permissions`, options);
    return true;
  }

  /**
   * Deletes an existing permission.
   *
   * https://coda.io/developers/apis/v1#operation/deletePermission
   *
   * @param permissionId ID of a permission on a doc; example: `AbCDeFGH`
   * @returns Returns true if permission was deleted.
   */
  async delete(permissionId: string): Promise<boolean> {
    await this.api.http.delete(`/docs/${this.id}/acl/permissions/${permissionId}`);
    return true;
  }
}

export default Permissions;
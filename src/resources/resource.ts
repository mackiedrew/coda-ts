import Api from '../api';

export enum ResourceType {
  Doc = 'doc', // https://coda.io/developers/apis/v1#tag/Docs
  Page = 'page', // https://coda.io/developers/apis/v1#tag/Pages
  Table = 'table', // https://coda.io/developers/apis/v1#tag/Tables
  Column = 'column', // https://coda.io/developers/apis/v1#tag/Columns
  Row = 'row', // https://coda.io/developers/apis/v1#tag/Rows
  Forumla = 'forumla', // https://coda.io/developers/apis/v1#tag/Formula
  Control = 'control', // https://coda.io/developers/apis/v1#tag/Control
  Account = 'user', // https://coda.io/developers/apis/v1#tag/Account
  ApiLink = 'apiLink', // https://coda.io/developers/apis/v1#operation/resolveBrowserLink

  // Mutation isn't an object or a resource type but it fulfills a similar role
  Mutation = 'mutation', // https://coda.io/developers/apis/v1#operation/getMutationStatus
  Automation = 'automation',

  // No API but still resources
  Folder = 'folder',
  Workspace = 'workspace',
  Metadata = 'aclMetadata',
}

export interface ItemResponse<T extends ResourceType> {
  id: string;
  name: string;
  href: string;
  type: T;
}

export interface ListResponse<T> {
  items: T[];
  href: string;
  nextPageToken: string;
  nextPageLink: string;
}

/**
 * https://coda.io/developers/apis/v1#section/Using-the-API/Resource-IDs-and-Links
 */
export class Resource {
  constructor(apiInstance: Api) {
    this.api = apiInstance;
  }

  public api: Api;

  // The resource's immutable ID, which can be used to refer to it within its context
  id: string;

  // The type of resource, useful for identifying it in a heterogenous collection of results
  type: ResourceType;

  // A fully qualified URI that can be used to refer to and get the latest details on the resource
  href: string;
}

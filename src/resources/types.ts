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
  item: T[];
  href: string;
  nextPageToken: string;
  nextPageLink: string;
}

import Api from '../api';

export enum ResourceType {
  Metadata = 'aclMetadata',
  Permissions = 'aclPermissions',
  ApiLink = 'apiLink',
  Automation = 'automation',
  Column = 'column',
  Control = 'control',
  Doc = 'doc',
  DocAnalytics = 'docAnalytics',
  DocAnalyticsSummary = 'docAnalyticsSummary',
  DocAnalyticsV2 = 'docAnalyticsV2',
  Folder = 'folder',
  Formula = 'formula',
  Mutation = 'mutationStatus',
  Pack = 'pack',
  PackAclPermissions = 'packAclPermissions',
  PackAnalytics = 'packAnalytics',
  PackAnalyticsSummary = 'packAnalyticsSummary',
  PackAsset = 'packAsset',
  PackCategory = 'packCategory',
  PackFormulaAnalytics = 'packFormulaAnalytics',
  PackLog = 'packLog',
  PackMaker = 'packMaker',
  PackOAuthConfig = 'packOauthConfig',
  PackRelease = 'packRelease',
  PackSourceCode = 'packSourceCode',
  PackSystemConnection = 'packSystemConnection',
  PackVersion = 'packVersion',
  Page = 'page',
  Row = 'row',
  Table = 'table',
  User = 'user',
  Workspace = 'workspace',
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

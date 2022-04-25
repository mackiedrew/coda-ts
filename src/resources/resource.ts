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

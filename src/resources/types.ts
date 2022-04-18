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
  Mutation = 'mutation', // https://coda.io/developers/apis/v1#operation/getMutationStatus
}

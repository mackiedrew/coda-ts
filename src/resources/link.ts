import { Resource, ResourceType } from './base';

// https://coda.io/developers/apis/v1#operation/resolveBrowserLink
export type Link = {
  type: ResourceType.ApiLink; // The type of this resource.
  href: string; // Self link to this query.
  resource: Resource<ResourceType>; // Reference to the resolved resource.
  browserLink?: string; // Canonical browser-friendly link to the resolved resource.
};

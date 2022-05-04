import { Resource, ResourceType } from './base';

export interface Link {
  type: ResourceType.ApiLink;
  href: string;
  resource: Resource<ResourceType>;
  browserLink?: string; // Canonical browser-friendly link to the resolved resource.
}

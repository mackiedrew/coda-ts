import { ResourceType } from './base';

export type WorkspaceRef = {
  id: string; // ID of the Coda workspace; example: `ws-ABC123`
  type: ResourceType.Workspace; // The type of this resource.
  browserLink: string; // Browser-friendly link to the Coda workspace.
  organizationId?: string; // ID of the organization bound to this workspace, if any; example: `org-ABC123`
};

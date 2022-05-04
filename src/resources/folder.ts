import { ResourceType } from './resource';

export interface Folder {
  id: string; // ID of the Coda folder; example: `fl-ABC123`
  type: ResourceType.Folder; // The type of this resource.
  browserLink: string; // Browser-friendly link to the Coda workspace.
}

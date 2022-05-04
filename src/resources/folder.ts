import { ResourceType } from './base';

// Type defined here: https://coda.io/developers/apis/v1#operation/listDocs
export interface FolderRef {
  id: string; // ID of the Coda folder; example: `fl-ABC123`
  type: ResourceType.Folder; // The type of this resource.
  browserLink: string; // Browser-friendly link to the Coda workspace.
}

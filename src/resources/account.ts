import { ResourceType } from './base';
import { WorkspaceRef } from './workspace';

// https://coda.io/developers/apis/v1#operation/whoami
export type WhoAmI = {
  name: string; // Name of the user.
  loginId: string; // Email address of the user.
  type: ResourceType.User; // The type of this resource.
  scoped: boolean; // True if the token used to make this request has restricted/scoped access to the API.
  tokenName: string; // Returns the name of the token used for this request.
  href: string; // API link to the user.
  workspace: WorkspaceRef; // Reference to a Coda workspace.
  pictureLink?: string; // Browser-friendly link to the user's avatar image.
};

import { ResourceType } from './resource';
import { Workspace } from './workspace';

export interface WhoAmI {
  name: string; // Name of the user.
  loginId: string; // Email address of the user.
  type: ResourceType.User; // The type of this resource.
  scoped: boolean; // True if the token used to make this request has restricted/scoped access to the API.
  tokenName: string; // Returns the name of the token used for this request.
  href: string; // API link to the user.
  workspace: Workspace; // Reference to a Coda workspace.
  pictureLink: string; // Browser-friendly link to the user's avatar image.
}

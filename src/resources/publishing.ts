export interface PublishInfo {
  description: string;
  browserLink: string;
  imageLink: string;
  discoverable: boolean;
  earnCredit: boolean;
  mode: boolean;
  categories: string[];
}

// Type described here: https://coda.io/developers/apis/v1#operation/publishDoc
export enum PublishMode {
  View = 'view',
  Play = 'play',
  Edit = 'edit',
}

// Many of these options are not set as required (in the Coda official docs) but most are for initial publishing.
export interface PublishOptions {
  slug: string; // Slug for the published doc.
  discoverable: boolean; // If true, indicates that the doc is discoverable.
  earnCredit: boolean; // If true, new users may be required to sign in to view content within this document.
  categoryNames: string[]; // The names of categories to apply to the document.
  mode: PublishMode;
}

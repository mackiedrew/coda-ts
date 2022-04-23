import Api from '../api';
import { Resource } from './resource';
import { ItemResponse, ListResponse, ResourceType } from './types';

// https://coda.io/developers/apis/v1#operation/createDoc
export interface CreateDocDto {
  title?: string; // Title of the new doc. Defaults to 'Untitled'.
  sourceDoc?: string; // An optional doc ID from which to create a copy.
  timezone?: string; // The timezone to use for the newly created doc.
  folderId?: string; // The ID of the folder within which to create this doc. Defaults to your "My docs" folder in the oldest workspace you joined
}

export interface Icon {
  name: string;
  type: string;
  browserLink: string;
}

export interface DocSize {
  totalRowCount: number;
  tableAndViewCount: number;
  pageCount: number;
  overApiSizeLimit: boolean;
}

export interface SourceDoc {
  id: string;
  type: ResourceType.Doc;
  href: string;
  browserLink: string;
}

export interface DocResponse extends ItemResponse<ResourceType.Doc> {
  browserLink: string;
  icon: Icon;
  name: string;
  owner: string;
  ownerName: string;
  docSize: DocSize;
  sourceDoc: SourceDoc;
  createdAt: string;
  updatedAt: string;
  published: {
    description: string;
    browserLink: string;
    imageLink: string;
    discoverable: boolean;
    earnCredit: boolean;
    mode: boolean;
    categories: string[];
  };
  folder: {
    id: string; // 'fl-ABC123'
    type: ResourceType.Folder;
    browserLink: string;
  };
  workspace: {
    id: string; // 'ws-ABC123'
    type: ResourceType.Workspace;
    organizationId: string; // 'org-ABC123'
    browserLink: string;
  };
  workspaceId: string;
  folderId: string;
}

// https://coda.io/developers/apis/v1#operation/listDocs
export interface ListDocOptions {
  isOwner?: boolean; // Show only docs owned by the user.
  isPublisher?: boolean; // Show only published docs.
  query?: string; // Search term used to filter down resutls.
  sourceDoc?: string; // Show only docs copied from the specified doc ID.
  isStarred?: boolean; // If true, returns docs that are starred. If false, returns docs that are not starred.
  inGallery?: boolean; // Show only docs visible within the gallery.
  workspaceId?: string; // Show only docs belonging to the given workspace.
  folderid?: string; // Show only docs belonging to the given folder.
  limit?: number; // Maximum number of results to return in this query. (default=25)
  pageToken?: string; // An opaque token used to fetch the next page of results.
}

export type ListDocResponse = ListResponse<DocResponse>;

export class Doc extends Resource {
  constructor(apiInstance: Api) {
    super(apiInstance);
  }
  async create(docData: CreateDocDto): Promise<DocResponse> {
    const response = await this.api.http.post<DocResponse>(`/docs`, docData);
    return response.data;
  }

  //   async get(): DocResponse {}

  async list(options: ListDocOptions): Promise<ListDocResponse> {
    const response = await this.api.http.get<ListDocResponse>(`/docs`, { params: options });
    return response.data;
  }

  //   async delete() {}
}

export default Doc;

import Api from '../api';
import { PageRef } from './page';
import { ItemResponse, ListResponse, Resource, ResourceType } from './resource';

export interface ListControlsOptions {
  limit?: number; // Maximum number of results to return in this query; default: 25
  pageToken?: string; // An opaque token used to fetch the next page of results.
  sortBy?: string; // Determines how to sort the given objects.
}

export interface ControlResource extends ItemResponse<ResourceType.Control> {
  parent: PageRef;
}

/**
 * A Controls API interface class.
 *
 * Controls provide a user-friendly way to input a value that can affect other parts of the doc.
 * This API lets you list controls and get their current values.
 *
 * https://coda.io/developers/apis/v1#tag/Controls
 *
 */
export class Control extends Resource {
  /**
   * @param apiInstance The API instance used to make the API call.
   */
  constructor(apiInstance: Api) {
    super(apiInstance);
  }

  /**
   * Returns a list of controls in a Coda doc.
   *
   * https://coda.io/developers/apis/v1#operation/listControls
   *
   * @param docId ID of the doc; example: `AbCDeFGH`
   * @param options Options for the request. See types or docs for details.
   * @returns A list of controls in a Coda doc.
   */
  async list(docId: string, options: ListControlsOptions): Promise<ListResponse<ControlResource>> {
    const response = await this.api.http.get<ListResponse<ControlResource>>(
      `/docs/${docId}/controls`,
      {
        params: options,
      },
    );
    return response.data;
  }

  /**
   * Returns info on a control.
   *
   * https://coda.io/developers/apis/v1#operation/getControl
   *
   * @param docId ID of the doc; example: `AbCDeFGH`
   * @param controlIdOrName ID or name of the control. Names are discouraged because they're
   * easily prone to being changed by users. If you're using a name, be sure to URI-encode it.
   * @returns Info on a control.
   */
  async get(docId: string, controlIdOrName: string): Promise<ControlResource> {
    const response = await this.api.http.get<ControlResource>(
      `/docs/${docId}/controls/${controlIdOrName}`,
    );
    return response.data;
  }
}

export default Control;

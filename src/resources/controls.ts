import { Api } from '../api';
import { PageRef } from './page';
import { Pagination, Resource, ResourceList, ResourceType } from '../types/resource';
import { CellValue } from '../types/values';

export enum ControlType {
  Button = 'button',
  Checkbox = 'checkbox',
  DatePicker = 'datePicker',
  DateRangePicker = 'dateRangePicker',
  Lookup = 'lookup',
  Multiselect = 'multiselect',
  Select = 'select',
  Scale = 'scale',
  Slider = 'slider',
  Reaction = 'reaction',
}

export interface ListControlsOptions extends Pagination {
  sortBy?: string; // Determines how to sort the given objects.
}

export interface ControlListElement extends Resource<ResourceType.Control> {
  controlType: ControlType;
  parent: PageRef;
}

export interface Control extends Resource<ResourceType.Control> {
  controlType: ControlType;
  value: CellValue;
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
export class Controls {
  private api: Api;
  private path: string;

  public docId: string;

  constructor(api: Api, docId: string) {
    this.api = api;
    this.docId = docId;

    this.path = `/docs/${docId}/controls`;
  }

  /**
   * Returns a list of controls in a Coda doc.
   *
   * https://coda.io/developers/apis/v1#operation/listControls
   *
   * @param options Options for the request. See types or docs for details.x
   * @returns A list of controls in a Coda doc.
   */
  async list(options: ListControlsOptions = {}): Promise<ResourceList<ControlListElement>> {
    const response = await this.api.http.get<ResourceList<ControlListElement>>(this.path, {
      params: options,
    });
    return response.data;
  }

  /**
   * Returns info on a control; this is how you get the current value of the control as well.
   *
   * https://coda.io/developers/apis/v1#operation/getControl
   *
   * @param controlIdOrName ID or name of the control. Names are discouraged because they're
   * easily prone to being changed by users. If you're using a name, be sure to URI-encode it.
   * @returns Info on a control.
   */
  async get(controlIdOrName: string): Promise<Control> {
    const response = await this.api.http.get<Control>(`${this.path}/${controlIdOrName}`);
    return response.data;
  }
}

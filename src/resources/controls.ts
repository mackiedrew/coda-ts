import { AxiosInstance } from 'axios';
import { PageRef } from './page';
import { Pagination, Resource, ResourceList, ResourceType } from './base';
import { CellValue } from './values';

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

export interface ControlRef extends Resource<ResourceType.Control> {
  controlType: ControlType;
  parent: PageRef;
}

export interface Control extends Resource<ResourceType.Control> {
  controlType: ControlType;
  value: CellValue;
}

interface ListControlsOptions extends Pagination {
  sortBy?: string; // Determines how to sort the given objects.
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
  private http: AxiosInstance;
  private readonly path: string;

  public readonly docId: string;

  constructor(http: AxiosInstance, docId: string) {
    this.http = http;
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
  public async list(options: ListControlsOptions = {}): Promise<ResourceList<ControlRef>> {
    const { data } = await this.http.get<ResourceList<ControlRef>>(this.path, {
      params: options,
    });
    return data;
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
  public async get(controlIdOrName: string): Promise<Control> {
    const { data } = await this.http.get<Control>(`${this.path}/${controlIdOrName}`);
    return data;
  }
}

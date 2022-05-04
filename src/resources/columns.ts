import { Api } from '../api';
import { Resource, ResourceList, Pagination, ResourceType } from './resource';
import { TableRef } from './table';

export interface ListColumnOptions extends Pagination {
  visibleOnly?: boolean; // If true, returns only visible columns for the table.
}

export enum ColumnType {
  Text = 'text',
  Person = 'person',
  Lookup = 'lookup',
  Number = 'number',
  Percent = 'percent',
  Currency = 'currency',
  Date = 'date',
  DateTime = 'dateTime',
  Time = 'time',
  Duration = 'duration',
  Slider = 'slider',
  Scale = 'scale',
  Image = 'image',
  Attachments = 'attachements',
  Button = 'button',
  Checkbox = 'checkbox',
  Select = 'select',
  PackObject = 'packObject',
  Canvas = 'cavas',
  Other = 'other',
  EmailColumnFormat = 'EmailColumnFormat',
  LinkColumnFormat = 'LinkColumnFormat',
}

export interface ColumnFormatDefault<T extends ColumnType> {
  type: T;
  isArray: boolean;
}

export type ColumnText = ColumnFormatDefault<ColumnType.Text>;
export interface ColumnPerson extends ColumnFormatDefault<ColumnType.Person> {
  table: TableRef;
}
export interface ColumnLookup extends ColumnFormatDefault<ColumnType.Lookup> {
  table: TableRef;
}
export interface ColumnNumber extends ColumnFormatDefault<ColumnType.Number> {
  precision?: number; // The decimal precision. (0 to 10)
  useThousandsSeparator: boolean; // Whether to use a thousands separator (like ",") to format the numeric value.
}

export type ColumFormat = ColumnText | ColumnPerson | ColumnLookup | ColumnNumber;

export interface Column extends Resource<ResourceType.Column> {
  format: ColumFormat; // Format of a column.
  display?: boolean; // Whether the column is the display column.
  calculated?: boolean; // Whether the column has a formula set on it.
  formula?: string; // Formula on the column.
  defaultValue?: string; // Default value formula for the column.
}

/**
 * A Column API interface class.
 *
 * https://coda.io/developers/apis/v1#tag/Columns
 */
export class Columns {
  private api: Api;

  public docId: string;
  public tableIdOrName: string;

  constructor(api: Api, docId: string, tableIdOrName: string) {
    this.api = api;
    this.docId = docId;
    this.tableIdOrName = tableIdOrName;
  }

  /**
   * List columns.
   *
   * https://coda.io/developers/apis/v1#operation/listColumns
   *
   * @param options Options for the query, see type or docs for details.
   * @returns list of columns in a table.
   */
  async list(options: ListColumnOptions = {}): Promise<ResourceList<Column>> {
    const response = await this.api.http.get<ResourceList<Column>>(
      `/docs/${this.docId}/tables/${this.tableIdOrName}/columns`,
      {
        params: options,
      },
    );
    return response.data;
  }

  /**
   * Get a column.
   *
   * https://coda.io/developers/apis/v1#operation/getColumn
   *
   * @param columnIdOrName ID or name of the column. Names are discouraged because
   * they're easily proneto being changed by users. If you're using a name,
   * be sure to URI-encode it; example: `c-pqRst-U`
   * @returns Details about a column in a table.
   */
  async get(columnIdOrName: string): Promise<Column> {
    const response = await this.api.http.get<Column>(
      `/docs/${this.docId}/tables/${this.tableIdOrName}/columns/${columnIdOrName}`,
    );
    return response.data;
  }
}

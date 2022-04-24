import Api from '../api';
import Mutation from './mutation';
import { ItemResponse, ListResponse, Resource, ResourceType } from './resource';
import { TableRef } from './table';
import { CellValue, ScalarValue } from './values';

export interface RowResourceOfTable extends ItemResponse<ResourceType.Row> {
  index: number; // Index of the row within the table; always positive integer
  browserLink: string; // Browser-friendly link to the row;
  createdAt: string; // Timestamp for when the row was created.
  updatedAt: string; // Timestamp for when the row was last modified.
  values: { [key: string]: CellValue }; // Values for a specific row, represented as a hash of column IDs (or names with useColumnNames) to values.
}

export interface RowResource extends RowResourceOfTable {
  parent: TableRef;
}

export interface RowListQueryById {
  queryString: string;
  columnId: string;
}

export interface RowListQueryByName {
  queryString: string;
  columnName: string;
}

/**
 * Specifies the sort order of the rows returned. If left unspecified, rows are returned by creation
 * time ascending. "UpdatedAt" sort ordering is the order of rows based upon when they were last updated.
 * This does not include updates to calculated values. "Natural" sort ordering is the order that the
 * rows appear in the table view in the application. This ordering is only meaningfully defined for rows
 * that are visible (unfiltered). Because of this, using this sort order will imply visibleOnly=true,
 * that is, to only return visible rows. If you pass sortBy=natural and visibleOnly=false explicitly,
 * this will result in a Bad Request error as this condition cannot be satisfied.
 */
export enum RowSortBy {
  CreatedAt = 'createdAt',
  Natural = 'natural',
  UpdatedAt = 'updatedAt',
}

export enum RowValueFormat {
  Simple = 'simple',
  SimpleWithArrays = 'simpleWithArrays',
  Rich = 'rich',
}

export type RowListQuery = RowListQueryById | RowListQueryByName;

export interface RowListOptions {
  query?: RowListQuery;
  sortBy?: RowSortBy;
  useColumnNames?: boolean; // Use column names instead of column IDs in the returned output. This is generally discouraged as it is fragile. If columns are renamed, code using original names may throw errors.
  valueFormat?: RowValueFormat; // The format that cell values are returned as.
  visibleOnly?: boolean;
  limit?: number;
  pageToken?: string;
  syncToken?: string;
}

export type CellData = {
  column: string; // Column ID, URL, or name (fragile and discouraged) associated with this edit.
  value: ScalarValue;
};

export type RowData = CellData[];

export interface RowUpsertDto {
  rows: RowData[];
  keyColumns?: string[];
}

export interface ListRowResponse extends ListResponse<RowResourceOfTable> {
  // If specified, an opaque token that can be passed back later to retrieve new results that
  // match the parameters specified when the sync token was created.
  nextSyncToken: string;
}

/**
 * Row API interface.
 *
 * You'll likely use this part of the API the most. These endpoints let you retrieve row data from
 * tables in Coda as well as create, upsert, update, and delete them. Most of these endpoints work
 * for both base tables and views, but for inserting/upsering rows, you must use a base table.
 *
 * https://coda.io/developers/apis/v1#tag/Rows
 *
 */
export class Row extends Resource {
  /**
   * @param apiInstance The API instance used to make the API call.
   */
  constructor(apiInstance: Api) {
    super(apiInstance);
  }

  async list(
    docId: string,
    tableIdOrName: string,
    options: RowListOptions,
  ): Promise<ListRowResponse> {
    return true;
  }

  async upsert(
    docId: string,
    tableIdOrName: string,
    data: RowUpsertDto,
    disableParsing = false,
  ): Promise<{ mutation: Mutation; rowIds: string[] }> {
    return true;
  }

  async deleteMany(
    docId: string,
    tableIdOrName: string,
    rowIds: string[],
  ): Promise<{ mutation: Mutation; rowIds: string[] }> {
    return true;
  }

  async get(
    docId: string,
    tableIdOrName: string,
    rowIdOrName: string,
    useColumnNames: boolean,
    valueFormat: RowValueFormat,
  ): Promise<RowResource> {
    return true;
  }

  async update(
    docId: string,
    tableIdOrName: string,
    rowIdOrName: string,
    data: RowData,
    disableParsing = false,
  ): Promise<{ mutation: Mutation; id: string }> {
    return true;
  }

  async delete(
    docId: string,
    tableIdOrName: string,
    rowIdOrName: string,
  ): Promise<{ mutation: Mutation; id: string }> {
    return true;
  }

  async pushButton(
    docId: string,
    tableIdOrName: string,
    rowIdOrName: string,
    columnIdOrName: string,
  ): Promise<{ mutation: Mutation; rowId: string; columnId: string }> {
    return true;
  }
}

export default Row;

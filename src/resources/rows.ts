import { Api } from '../api';
import { Mutation } from './mutation';
import { ResourceList, Pagination } from '../types/resource';
import { ScalarValue } from '../types/values';
import { RowRef, RowDto, RowValueFormat, Row } from './row';

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

export enum RowListQueryType {
  ID = 'id',
  Name = 'name',
}

export interface RowListQueryById {
  type: RowListQueryType.ID;
  queryString: string;
  columnId: string;
}

export interface RowListQueryByName {
  type: RowListQueryType.Name;
  queryString: string;
  columnName: string;
}

export type RowListQuery = RowListQueryById | RowListQueryByName;

export interface RowListOptions extends Pagination {
  query?: RowListQuery;
  sortBy?: RowSortBy;
  useColumnNames?: boolean; // Use column names instead of column IDs in the returned output. This is generally discouraged as it is fragile. If columns are renamed, code using original names may throw errors.
  valueFormat?: RowValueFormat; // The format that cell values are returned as.
  visibleOnly?: boolean;
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

export interface ListRowResponse extends ResourceList<RowRef> {
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
export class Rows {
  private api: Api;
  private path: string;

  public docId: string;
  public tableIdOrName: string;

  constructor(api: Api, docId: string, tableIdOrName: string) {
    this.api = api;
    this.docId = docId;
    this.tableIdOrName = tableIdOrName;

    this.path = `/docs/${docId}/tables/${tableIdOrName}/rows`;
  }

  constructQuery(query?: RowListQuery): string | void {
    if (!query) return;
    if (query.type === RowListQueryType.Name) return `"${query.columnName}":${query.queryString}`;
    return `${query.columnId}:${query.queryString}`;
  }

  async list(options: RowListOptions): Promise<ListRowResponse> {
    const response = await this.api.http.get<ListRowResponse>(this.path, {
      params: { ...options, query: this.constructQuery(options.query) },
    });
    return response.data;
  }

  async upsert(
    data: RowUpsertDto,
    disableParsing = false,
  ): Promise<{ mutation: Mutation; rowIds: string[] }> {
    const response = await this.api.http.post<{
      requestId: string;
      rowIds: string[];
    }>(this.path, data, {
      params: { disableParsing },
    });
    return {
      mutation: new Mutation(this.api, response.data.requestId),
      rowIds: response.data.rowIds,
    };
  }

  async delete(rowIds: string[]): Promise<{ mutation: Mutation; rowIds: string[] }> {
    const response = await this.api.http.delete<{
      requestId: string;
      rowIds: string[];
    }>(this.path, { data: { rowIds } });
    return {
      mutation: new Mutation(this.api, response.data.requestId),
      rowIds: response.data.rowIds,
    };
  }

  async get(
    rowIdOrName: string,
    useColumnNames = false,
    valueFormat: RowValueFormat = RowValueFormat.Rich,
  ): Promise<Row> {
    const row = new Row(this.api, this.docId, this.tableIdOrName, rowIdOrName);
    await row.refresh(useColumnNames, valueFormat);
    return row;
  }
}

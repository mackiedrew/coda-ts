import { Api } from '../api';
import { Mutation } from './mutation';
import { Resource, ResourceType } from '../types/resource';
import { TableRef } from './table';
import { CellValue, ScalarValue } from '../types/values';

export interface RowResourceOfTable extends Resource<ResourceType.Row> {
  index: number; // Index of the row within the table; always positive integer
  browserLink: string; // Browser-friendly link to the row;
  createdAt: string; // Timestamp for when the row was created.
  updatedAt: string; // Timestamp for when the row was last modified.
  values: { [key: string]: CellValue }; // Values for a specific row, represented as a hash of column IDs (or names with useColumnNames) to values.
}

export interface RowResource extends RowResourceOfTable {
  parent: TableRef;
}

export enum RowValueFormat {
  Simple = 'simple',
  SimpleWithArrays = 'simpleWithArrays',
  Rich = 'rich',
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

export type CellData = {
  column: string; // Column ID, URL, or name (fragile and discouraged) associated with this edit.
  value: ScalarValue;
};

export type RowData = CellData[];

export class Row {
  private api: Api;
  constructor(api: Api) {
    this.api = api;
  }

  async get(
    docId: string,
    tableIdOrName: string,
    rowIdOrName: string,
    useColumnNames: boolean,
    valueFormat: RowValueFormat,
  ): Promise<RowResource> {
    const response = await this.api.http.get<RowResource>(
      `/docs/${docId}/tables/${tableIdOrName}/rows/${rowIdOrName}`,
      {
        params: { useColumnNames, valueFormat },
      },
    );
    return response.data;
  }

  async update(
    docId: string,
    tableIdOrName: string,
    rowIdOrName: string,
    data: RowData,
    disableParsing = false,
  ): Promise<{ mutation: Mutation; rowId: string }> {
    const response = await this.api.http.put<{
      requestId: string;
      id: string;
    }>(`/docs/${docId}/tables/${tableIdOrName}/rows/${rowIdOrName}`, data, {
      params: { disableParsing },
    });
    return {
      mutation: new Mutation(this.api, response.data.requestId),
      rowId: response.data.id,
    };
  }

  async delete(
    docId: string,
    tableIdOrName: string,
    rowIdOrName: string,
  ): Promise<{ mutation: Mutation; rowId: string }> {
    const response = await this.api.http.delete<{
      requestId: string;
      id: string;
    }>(`/docs/${docId}/tables/${tableIdOrName}/rows/${rowIdOrName}`);
    return {
      mutation: new Mutation(this.api, response.data.requestId),
      rowId: response.data.id,
    };
  }

  async pushButton(
    docId: string,
    tableIdOrName: string,
    rowIdOrName: string,
    columnIdOrName: string,
  ): Promise<{ mutation: Mutation; rowId: string; columnId: string }> {
    const response = await this.api.http.post<{
      requestId: string;
      rowId: string;
      columnId: string;
    }>(`/docs/${docId}/tables/${tableIdOrName}/rows/${rowIdOrName}/buttons/${columnIdOrName}`);
    return {
      mutation: new Mutation(this.api, response.data.requestId),
      rowId: response.data.rowId,
      columnId: response.data.columnId,
    };
  }
}

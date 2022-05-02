import { Api } from '../api';
import { Mutation } from './mutation';
import { Resource, ResourceType } from '../types/resource';
import { TableRef } from './table';
import { CellValue, ScalarValue } from '../types/values';

export interface RowRef extends Resource<ResourceType.Row> {
  index: number; // Index of the row within the table; always positive integer
  browserLink: string; // Browser-friendly link to the row;
  createdAt: string; // Timestamp for when the row was created.
  updatedAt: string; // Timestamp for when the row was last modified.
  values: { [key: string]: CellValue }; // Values for a specific row, represented as a hash of column IDs (or names with useColumnNames) to values.
}

export interface RowDto extends RowRef {
  parent: TableRef;
}

export enum RowValueFormat {
  Simple = 'simple',
  SimpleWithArrays = 'simpleWithArrays',
  Rich = 'rich',
}

export type CellData = {
  column: string; // Column ID, URL, or name (fragile and discouraged) associated with this edit.
  value: ScalarValue;
};

export type RowData = CellData[];

export class Row {
  private api: Api;
  private path: string;

  public type = ResourceType.Row;
  public id: string;
  public docId: string;
  public tableIdOrName: string;

  public index?: number;
  public browserLink?: string;
  public createdAt?: string;
  public updatedAt?: string;
  public values?: { [key: string]: CellValue };
  public parent?: TableRef;

  constructor(api: Api, docId: string, tableIdOrName: string, rowIdOrName: string) {
    this.api = api;
    this.docId = docId;
    this.tableIdOrName = tableIdOrName;
    this.id = rowIdOrName;

    this.path = `/docs/${docId}/tables/${tableIdOrName}/rows/${rowIdOrName}`;
  }

  async get(useColumnNames: boolean, valueFormat: RowValueFormat): Promise<Row> {
    const response = await this.api.http.get<RowDto>(this.path, {
      params: { useColumnNames, valueFormat },
    });
    return this.set(response.data);
  }

  async update(
    data: RowData,
    disableParsing = false,
  ): Promise<{ mutation: Mutation; rowId: string }> {
    const response = await this.api.http.put<{
      requestId: string;
      id: string;
    }>(this.path, data, {
      params: { disableParsing },
    });
    return {
      mutation: new Mutation(this.api, response.data.requestId),
      rowId: response.data.id,
    };
  }

  async delete(): Promise<{ mutation: Mutation; rowId: string }> {
    const response = await this.api.http.delete<{
      requestId: string;
      id: string;
    }>(this.path);
    return {
      mutation: new Mutation(this.api, response.data.requestId),
      rowId: response.data.id,
    };
  }

  set(row: Row | RowDto): Row {
    this.index = row.index;
    this.browserLink = row.browserLink;
    this.createdAt = row.createdAt;
    this.updatedAt = row.updatedAt;
    this.values = row.values;
    this.parent = row.parent;
    return this;
  }

  async refresh(useColumnNames: boolean, valueFormat: RowValueFormat): Promise<Row | void> {
    const row = await this.get(useColumnNames, valueFormat);
    if (row) this.set(row);
    return row;
  }

  async pushButton(
    columnIdOrName: string,
  ): Promise<{ mutation: Mutation; rowId: string; columnId: string }> {
    const response = await this.api.http.post<{
      requestId: string;
      rowId: string;
      columnId: string;
    }>(`${this.path}/buttons/${columnIdOrName}`);
    return {
      mutation: new Mutation(this.api, response.data.requestId),
      rowId: response.data.rowId,
      columnId: response.data.columnId,
    };
  }
}

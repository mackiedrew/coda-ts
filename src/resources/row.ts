import { AxiosInstance } from 'axios';
import { Mutation } from './mutation';
import { Resource, ResourceType } from './base';
import { TableRef } from './table';
import { CellValue, ScalarValue } from './values';

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
  private readonly http: AxiosInstance;
  private readonly path: string;

  public readonly type = ResourceType.Row;
  public readonly id: string;
  public readonly docId: string;
  public readonly tableIdOrName: string;

  public index?: number;
  public browserLink?: string;
  public createdAt?: string;
  public updatedAt?: string;
  public values?: { [key: string]: CellValue };
  public parent?: TableRef;

  constructor(http: AxiosInstance, docId: string, tableIdOrName: string, rowIdOrName: string) {
    this.http = http;
    this.docId = docId;
    this.tableIdOrName = tableIdOrName;
    this.id = rowIdOrName;

    this.path = `/docs/${docId}/tables/${tableIdOrName}/rows/${rowIdOrName}`;
  }

  public async get(
    useColumnNames = false,
    valueFormat: RowValueFormat = RowValueFormat.Rich,
  ): Promise<Row> {
    const { data } = await this.http.get<RowDto>(this.path, {
      params: { useColumnNames, valueFormat },
    });
    return this.set(data);
  }

  public async update(
    rowData: RowData,
    disableParsing = false,
  ): Promise<{ mutation: Mutation; rowId: string }> {
    const { data } = await this.http.put<{
      requestId: string;
      id: string;
    }>(
      this.path,
      { row: { cells: rowData } },
      {
        params: { disableParsing },
      },
    );
    return {
      mutation: new Mutation(this.http, data.requestId),
      rowId: data.id,
    };
  }

  public async delete(): Promise<{ mutation: Mutation; rowId: string }> {
    const { data } = await this.http.delete<{
      requestId: string;
      id: string;
    }>(this.path);
    return {
      mutation: new Mutation(this.http, data.requestId),
      rowId: data.id,
    };
  }

  public set(row: Row | RowDto): Row {
    this.index = row.index;
    this.browserLink = row.browserLink;
    this.createdAt = row.createdAt;
    this.updatedAt = row.updatedAt;
    this.values = row.values;
    this.parent = row.parent;
    return this;
  }

  public async pushButton(
    columnIdOrName: string,
  ): Promise<{ mutation: Mutation; rowId: string; columnId: string }> {
    const { data } = await this.http.post<{
      requestId: string;
      rowId: string;
      columnId: string;
    }>(`${this.path}/buttons/${columnIdOrName}`);
    return {
      mutation: new Mutation(this.http, data.requestId),
      rowId: data.rowId,
      columnId: data.columnId,
    };
  }
}

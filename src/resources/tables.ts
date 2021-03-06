import { AxiosInstance } from 'axios';
import { ResourceList, Pagination } from './base';
import { Table, TableDto, TableType } from './table';

export interface TableListOptions extends Pagination {
  sortBy?: string; // Determines how to sort the given objects.
  tabledTypes?: TableType;
}

/**
 * A Table API interface class.
 *
 * https://coda.io/developers/apis/v1#tag/Tables
 */
export class Tables {
  private readonly http: AxiosInstance;
  public readonly docId: string;

  constructor(http: AxiosInstance, docId: string) {
    this.http = http;
    this.docId = docId;
  }

  /**
   * List of tables in a Coda doc.
   *
   * https://coda.io/developers/apis/v1#operation/listTables
   *
   * @param options Options for query. See type or docs for details.
   * @param useUpdatedTableLayouts Return "detail" and "form" for the layout field of
   * detail and form layouts respectively (instead of "masterDetail" for both)
   * @returns A list of tables in a Coda doc.
   */
  public async list(
    options: TableListOptions = {},
    useUpdatedTableLayouts = true,
  ): Promise<ResourceList<Table>> {
    const { data } = await this.http.get<ResourceList<TableDto>>(`/docs/${this.docId}/tables`, {
      params: options,
    });
    return {
      ...data,
      items: data.items.map((item) => {
        const table = new Table(this.http, this.docId, item.id, useUpdatedTableLayouts);
        table.set(item);
        return table;
      }),
    };
  }

  /**
   * Returns data for the specified table.
   *
   * https://coda.io/developers/apis/v1#operation/getTable
   *
   * @param tableIdOrName ID or name of the table. Names are discouraged because they're easily prone
   * to being changed by users. If you're using a name, be sure to URI-encode it; example: `grid-pqRst-U`
   * @param useUpdatedTableLayouts Return "detail" and "form" for the layout field of
   * detail and form layouts respectively (instead of "masterDetail" for both)
   * @returns Returns data for the specified table.
   */
  public async get(tableIdOrName: string, useUpdatedTableLayouts = true): Promise<Table> {
    const table = new Table(this.http, this.docId, tableIdOrName, useUpdatedTableLayouts);
    return await table.get();
  }
}

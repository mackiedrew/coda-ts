import Api from '../api';
import { PageRef } from './page';
import { ItemResponse, ListResponse, ResourceType } from './resource';

export enum TableType {
  Table = 'table',
  View = 'view',
}

export enum TableLayout {
  Default = 'default',
  AreaChart = 'areaChart',
  BarChart = 'barChart',
  BubbleChart = 'bubbleChart',
  Calendar = 'calendar',
  Card = 'card',
  Detail = 'detail',
  Form = 'form',
  GanttChart = 'ganttChart',
  LineChart = 'lineChart',
  MasterDetail = 'masterDetail',
  PieChart = 'pieChart',
  ScatterChart = 'scatterChart',
  Slide = 'slide',
  WordCloud = 'wordCloud',
}

export enum SortDirection {
  Ascending = 'ascending',
  Descending = 'descending',
}

export interface TableRef {
  id: string; // ID of the table.
  type: ResourceType.Table; // The type of this resource.
  browserLink: string; // Browser-friendly link to the page.
  tableType: TableType;
  name: string; // Name of the page.
  parent: PageRef; // Reference to a page.
}

export interface ColumnRef {
  id: string; // ID of the column.
  type: ResourceType.Column; // The type of this resource.
  href: string; // API link to the column.
}

export interface Sort {
  column: ColumnRef;
  direction: SortDirection;
}

export interface Filter {
  valid: boolean; // Returns whether or not the given formula is valid.
  isVolatile?: boolean; // Returns whether or not the given formula can return different results in different contexts (for example, for different users).
  hasUserFormula?: boolean; // Returns whether or not the given formula has a User() formula within it.
  hasTodayFormula?: boolean; // Returns whether or not the given formula has a Today() formula within it.
  hasNowFormula?: boolean; // Returns whether or not the given formula has a Now() formula within it.
}

export interface TableResource extends ItemResponse<ResourceType.Table> {
  tableType: TableType;
  parent: PageRef;
  browserLink: string; // Browser-friendly link to the page.
  displayColumn: ColumnRef; // Reference to a column.
  rowCount: number;
  sorts: Sort[];
  layout: TableLayout;
  createdAt: string;
  updatedAt: string;
  parentTable?: TableRef;
  filter?: Filter;
}

export interface TableListOption {
  limit: number; // Maximum number of results to return in this query; default: 25;
  pageToken: string; // An opaque token used to fetch the next page of results; example: eyJsaW1pd
  sortBy: string; // Determines how to sort the given objects.
  tabledTypes: TableType;
}

/**
 * A Table API interface class.
 *
 * https://coda.io/developers/apis/v1#tag/Tables
 */
export class Table {
  private api: Api;
  constructor(api: Api) {
    this.api = api;
  }

  /**
   * List of tables in a Coda doc.
   *
   * https://coda.io/developers/apis/v1#operation/listTables
   *
   * @param docId ID of the doc; example: `AbCDeFGH`
   * @param options Options for query. See type or docs for details.
   * @returns A list of tables in a Coda doc.
   */
  async list(docId: string, options: TableListOption): Promise<ListResponse<TableResource>> {
    const response = await this.api.http.get<ListResponse<TableResource>>(`/docs/${docId}/tables`, {
      params: options,
    });
    return response.data;
  }

  /**
   * Returns details about a specific table or view.
   *
   * https://coda.io/developers/apis/v1#operation/getTable
   *
   * @param docId ID of the doc; example: `AbCDeFGH`
   * @param tableIdOrName ID or name of the table. Names are discouraged because they're easily prone
   * to being changed by users. If you're using a name, be sure to URI-encode it; example: `grid-pqRst-U`
   * @param useUpdatedTableLayouts Return "detail" and "form" for the layout field of
   * detail and form layouts respectively (instead of "masterDetail" for both)
   * @returns Details about a specific table or view.
   */
  async get(
    docId: string,
    tableIdOrName: string,
    useUpdatedTableLayouts: boolean,
  ): Promise<TableResource> {
    const response = await this.api.http.get<TableResource>(
      `/docs/${docId}/tables/${tableIdOrName}`,
      {
        params: { useUpdatedTableLayouts },
      },
    );
    return response.data;
  }
}

export default Table;

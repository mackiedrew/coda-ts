import { AxiosInstance } from 'axios';
import { PageRef } from './page';
import { Resource, ResourceType } from './base';
import { Columns } from './columns';
import { Rows } from './rows';

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

export interface TableDto extends Resource<ResourceType.Table> {
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

/**
 * A Table API interface class.
 *
 * https://coda.io/developers/apis/v1#tag/Tables
 */
export class Table {
  private http: AxiosInstance;

  public id: string;
  public docId: string;
  public type: ResourceType.Table = ResourceType.Table;

  public useUpdatedTableLayouts: boolean;

  public tableType?: TableType;
  public parent?: PageRef;
  public browserLink?: string;
  public displayColumn?: ColumnRef;
  public rowCount?: number;
  public sorts?: Sort[];
  public layout?: TableLayout;
  public createdAt?: string;
  public updatedAt?: string;
  public parentTable?: TableRef;
  public filter?: Filter;

  public Columns: Columns;
  public Rows: Rows;

  constructor(
    http: AxiosInstance,
    docId: string,
    tableIdOrName: string,
    useUpdatedTableLayouts: boolean,
  ) {
    this.http = http;
    this.docId = docId;
    this.id = tableIdOrName;
    this.useUpdatedTableLayouts = useUpdatedTableLayouts;

    this.Columns = new Columns(this.http, this.docId, this.id);
    this.Rows = new Rows(this.http, this.docId, this.id);
  }

  /**
   * Returns details about a specific table or view.
   *
   * https://coda.io/developers/apis/v1#operation/getTable
   *
   * @param tableIdOrName ID or name of the table. Names are discouraged because they're easily prone
   * to being changed by users. If you're using a name, be sure to URI-encode it; example: `grid-pqRst-U`
   * @returns Details about a specific table or view.
   */
  async get(tableIdOrName: string = this.id): Promise<Table | void> {
    const response = await this.http.get<TableDto>(`/docs/${this.docId}/tables/${tableIdOrName}`, {
      params: { useUpdatedTableLayouts: this.useUpdatedTableLayouts },
    });
    return this.set(response.data);
  }

  set(table: Table | TableDto): Table {
    this.tableType = table.tableType;
    this.parent = table.parent;
    this.browserLink = table.browserLink;
    this.displayColumn = table.displayColumn;
    this.rowCount = table.rowCount;
    this.sorts = table.sorts;
    this.layout = table.layout;
    this.createdAt = table.createdAt;
    this.updatedAt = table.updatedAt;
    this.parentTable = table.parentTable;
    this.filter = table.filter;
    return this;
  }

  async refresh(): Promise<Table | void> {
    const table = await this.get();
    if (table) this.set(table);
    return table;
  }
}

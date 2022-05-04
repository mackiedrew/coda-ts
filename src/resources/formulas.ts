import { AxiosInstance } from 'axios';
import { PageRef } from './page';
import { Resource, ResourceList, Pagination, ResourceType } from './base';
import { ScalarValue } from './values';

export interface FormulaRef extends Resource<ResourceType.Formula> {
  parent: PageRef;
}

export interface Formula extends Resource<ResourceType.Formula> {
  value: ScalarValue;
}

interface FormulaListOptions extends Pagination {
  sortBy?: string; // Determines how to sort the given objects.
}

/**
 * A Formula API interface class. Formulas can be great for performing one-off computations, or used with
 * tables and other formulas to compute a single value. With this API, you can discover formulas in a doc
 * and obtain computed results.
 *
 * https://coda.io/developers/apis/v1#tag/Formulas
 */
export class Formulas {
  private http: AxiosInstance;
  private readonly path: string;

  public readonly docId: string;

  constructor(http: AxiosInstance, docId: string) {
    this.http = http;
    this.docId = docId;

    this.path = `/docs/${this.docId}/formulas`;
  }

  /**
   * Returns a list of named formulas in a Coda doc.
   *
   * https://coda.io/developers/apis/v1#operation/listFormulas
   *
   * @param options Options for query. See type or docs for details.
   * @returns List of named formulas in a Coda doc.
   */
  public async list(options: FormulaListOptions = {}): Promise<ResourceList<FormulaRef>> {
    const { data } = await this.http.get<ResourceList<FormulaRef>>(this.path, {
      params: options,
    });
    return data;
  }

  /**
   * Returns info on a formula.
   *
   * https://coda.io/developers/apis/v1#operation/getFormula
   *
   * @param formulaIdOrName ID or name of the formula. Names are
   * discouraged because they're easily prone to being changed by users.
   * If you're using a name, be sure to URI-encode it; example: `f-fgHijkLm`
   * @returns Details about a formula.
   */
  public async get(formulaIdOrName: string): Promise<Formula> {
    const { data } = await this.http.get<Formula>(`${this.path}/${formulaIdOrName}`);
    return data;
  }
}

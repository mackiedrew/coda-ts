import { Api } from '../api';
import { PageRef } from './page';
import { Resource, ResourceList, Pagination, ResourceType } from './resource';
import { ScalarValue } from './values';

export interface FormulaListOptions extends Pagination {
  sortBy?: string; // Determines how to sort the given objects.
}

export interface FormulaRef extends Resource<ResourceType.Formula> {
  parent: PageRef;
}

export interface Formula extends Resource<ResourceType.Formula> {
  value: ScalarValue;
}

/**
 * A Formula API interface class. Formulas can be great for performing one-off computations, or used with
 * tables and other formulas to compute a single value. With this API, you can discover formulas in a doc
 * and obtain computed results.
 *
 * https://coda.io/developers/apis/v1#tag/Formulas
 */
export class Formulas {
  private api: Api;
  private path: string;

  public docId: string;

  constructor(api: Api, docId: string) {
    this.api = api;
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
  async list(options: FormulaListOptions = {}): Promise<ResourceList<FormulaRef>> {
    const response = await this.api.http.get<ResourceList<FormulaRef>>(this.path, {
      params: options,
    });
    return response.data;
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
  async get(formulaIdOrName: string): Promise<Formula> {
    const response = await this.api.http.get<Formula>(`${this.path}/${formulaIdOrName}`);
    return response.data;
  }
}

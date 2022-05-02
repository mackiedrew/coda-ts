import { Api } from '../api';
import { Mutation } from './mutation';

/**
 * An automation API interface class. This API allows you to trigger automations.
 *
 * https://coda.io/developers/apis/v1#operation/triggerWebhookAutomation
 */
export class Automation {
  private api: Api;
  private path: string;

  public docId: string;

  constructor(api: Api, docId: string) {
    this.api = api;
    this.docId = docId;

    this.path = `/docs/${this.docId}/hooks/automation`;
  }

  /**
   *
   * Triggers webhook-invoked automation
   *
   * https://coda.io/developers/apis/v1#tag/Automations
   *
   * @param ruleId ID of the automation rule; example: `grid-auto-b3Jmey6jBS`
   * @param payload any json-serializable object that the automation rule will expect. example: `{ message: "hello!" }`
   * @returns The status for an asynchronous mutation to know whether or not it has been completed.
   */
  async trigger(ruleId: string, payload: any): Promise<Mutation> {
    const response = await this.api.http.post<{ requestId: string }>(
      `${this.path}/${ruleId}`,
      payload,
    );
    return new Mutation(this.api, response.data.requestId);
  }
}

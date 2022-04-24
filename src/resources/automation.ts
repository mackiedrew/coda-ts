import Api from '../api';
import Mutation from './mutation';
import { Resource } from './resource';

export interface MutationStatus {
  completed: boolean;
}

/**
 * An automation API interface class. This API allows you to trigger automations.
 *
 * https://coda.io/developers/apis/v1#operation/triggerWebhookAutomation
 */
export class Automation extends Resource {
  /**
   * @param apiInstance The API instance used to make the API call.
   */
  constructor(apiInstance: Api) {
    super(apiInstance);
  }

  /**
   *
   * Triggers webhook-invoked automation
   *
   * https://coda.io/developers/apis/v1#operation/getMutationStatus
   *
   * @param docId ID of the doc; example: `AbCDeFGH`
   * @param ruleId ID of the automation rule; example: `grid-auto-b3Jmey6jBS`
   * @param payload any json-serializable object that the automation rule will expect. example: `{ message: "hello!" }`
   * @returns The status for an asynchronous mutation to know whether or not it has been completed.
   */
  async trigger(docId: string, ruleId: string, payload: any): Promise<Mutation> {
    const response = await this.api.http.post<{ requestId: string }>(
      `/docs/${docId}/hooks/automation/${ruleId}`,
      payload,
    );
    const mutation = new Mutation(this.api, response.data.requestId);
    return mutation;
  }
}

export default Automation;

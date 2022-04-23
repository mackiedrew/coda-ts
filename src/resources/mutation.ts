import Api from '../api';
import { Resource } from './resource';

export interface MutationStatus {
  completed: boolean;
}

/**
 * A mutation status API interface class.
 *
 * https://coda.io/developers/apis/v1#operation/getMutationStatus
 */
export class Mutation extends Resource {
  /**
   * ID of the request. example: `abc-123-def-456`
   */
  private requestId: string;
  constructor(apiInstance: Api, requestId: string) {
    super(apiInstance);
    this.requestId = requestId;
  }

  /**
   * Get the status for an asynchronous mutation to know whether or not it has been completed.
   * Each API endpoint that mutates a document will return a request id that you can pass to this
   * endpoint to check the completion status. Status information is not guaranteed to be available
   * for more than one day after the mutation was completed. It is intended to be used shortly
   * after the request was made.
   *
   * https://coda.io/developers/apis/v1#operation/getMutationStatus
   *
   * @returns The status for an asynchronous mutation to know whether or not it has been completed.
   */
  async status(): Promise<MutationStatus> {
    const response = await this.api.http.get<MutationStatus>(`/mutationStatus/${this.requestId}`);
    return response.data;
  }
}

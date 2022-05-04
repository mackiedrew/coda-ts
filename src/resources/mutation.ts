import { AxiosInstance } from 'axios';

/**
 * A mutation status API interface class.
 *
 * https://coda.io/developers/apis/v1#operation/getMutationStatus
 */
export class Mutation {
  private http: AxiosInstance;

  /**
   * ID of the request. example: `abc-123-def-456`
   */
  private requestId: string;

  constructor(http: AxiosInstance, requestId: string) {
    this.http = http;
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
   * @returns The status for an asynchronous mutation to know whether or not it has been completed (true = completed)
   */
  async status(): Promise<boolean> {
    const response = await this.http.get<{ completed: true }>(
      `/mutationStatus/${this.requestId}`,
    );
    return response.data.completed;
  }

  async wait(interval = 10_000, retries = 6): Promise<boolean> {
    for (let tries = 0; tries < retries; tries++) {
      const status = await this.status();
      if (status) return true;
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
    return false;
  }
}

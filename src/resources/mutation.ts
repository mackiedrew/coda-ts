import { AxiosInstance } from 'axios';

/**
 * A mutation status API interface class.
 *
 * https://coda.io/developers/apis/v1#operation/getMutationStatus
 */
export class Mutation {
  private readonly http: AxiosInstance;
  private readonly requestId: string;

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
  public async status(): Promise<boolean> {
    const { data } = await this.http.get<{ completed: true }>(`/mutationStatus/${this.requestId}`);
    return data.completed;
  }

  /**
   * Provides a promise that will resolve when the mutation is completed. Most write actions in Coda
   * return a mutation/requestId so it's important to be able to know when these mutations are complete.
   * Coda supplies an API to see when completed but nothing like a webhook to listen.
   *
   * On average most mutations take between 10 to 40 seconds to resolve. Row-deletions can often take
   * significantly longer. The longest observed mutation was just under 300 seconds.
   *
   * @param interval How many milliseconds between polling attempts.
   * @param retries How many retried before giving up polling.
   * @returns A promise of `true` if the mutation has completed successfully.
   * A promise of `false` if the mutation has not completed by the time the retries
   * have completed.
   */
  public async wait(interval = 10_000, retries = 6): Promise<boolean> {
    for (let tries = 0; tries < retries; tries++) {
      const status = await this.status();
      if (status) return true;
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
    return false;
  }
}

import Api from '../api';
import { Resource } from './resource';

export interface MutationStatusDto {
  requestId: string;
}

export interface MutationStatusResponse {
  completed: boolean;
}

/**
 * https://coda.io/developers/apis/v1#operation/getMutationStatus
 */
export class Mutation extends Resource {
  constructor(apiInstance: Api) {
    super(apiInstance);
  }

  async status({ requestId }: MutationStatusDto): Promise<MutationStatusResponse> {
    const response = await this.api.http.get<MutationStatusResponse>(
      `/mutationStatus/${requestId}`,
    );
    return response.data;
  }
}

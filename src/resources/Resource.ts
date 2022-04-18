import { ResourceType } from './types';

/**
 * https://coda.io/developers/apis/v1#section/Using-the-API/Resource-IDs-and-Links
 */
export class Resource {
  // The resource's immutable ID, which can be used to refer to it within its context
  id: string;

  // The type of resource, useful for identifying it in a heterogenous collection of results
  type: ResourceType;

  // A fully qualified URI that can be used to refer to and get the latest details on the resource
  href: string;
}

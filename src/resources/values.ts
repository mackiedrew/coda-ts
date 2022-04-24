export type ScalarValue = string | number | boolean | ScalarValue[];

export enum LinkedDataType {
  ImageObject = 'ImageObject',
  MonetaryAmount = 'MonetaryAmount',
  Person = 'Person',
  WebPage = 'WebPage',
  StructuredValue = 'StructuredValue',
}

export enum ImageStatus {
  Live = 'live',
  Deleted = 'deleted',
  Failed = 'failed',
}

export interface RichValuePrototype {
  '@context': string; // A url describing the schema context for this object, typically "http://schema.org/".
  '@type': LinkedDataType; // A schema.org identifier for the object.
  additionalType?: string; // An identifier of additional type info specific to Coda that may not be present in a schema.org taxonomy,
}

export interface CurrencyValue extends RichValuePrototype {
  currency: string; // The 3-letter currency code.
  amount: string | number; // A numeric monetary amount as a string or number.
}

export interface CurrencyValue extends RichValuePrototype {
  currency: string; // The 3-letter currency code.
  amount: string | number; // A numeric monetary amount as a string or number.
}

export interface ImageUrlValue extends RichValuePrototype {
  name?: string; // Name of the image
  url?: string; // Url of the image
  height?: number; // Height of the image in pixels
  width?: number; // Width of the image in pixels
  status?: ImageStatus;
}

export interface PersonValue extends RichValuePrototype {
  name: string; // Full name of the person
  url: string; // Email address of the person
}

export interface UrlValue extends RichValuePrototype {
  name?: string; // Full name of the person
  url: string; // Email address of the person
}

export interface RowValue extends RichValuePrototype {
  name: string; // The display name of the row, based on its identifying column
  url: string; // The url of the row
  tableId: string; // ID of the table
  tableUrl: string; // Url of the table
  rowId: string; // ID of the the table
  additionalType: 'row';
}

export type RichValue =
  | ScalarValue
  | CurrencyValue
  | ImageUrlValue
  | PersonValue
  | UrlValue
  | RowValue
  | RichValue[];

export type CellValue = ScalarValue | RichValue;

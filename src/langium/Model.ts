export interface EModel {
  json: {
    version: string;
    encoding: string;
  };
  ns: Record<string, string>;
  content: EObject[];
}

export interface EObject {
  id: string;
  eClass: string;
  data: Record<string, EFeatureType | EFeatureType[]>;
}

export type EFeatureType = string | number | boolean | EObject;

export function isEModel(object: unknown): object is EModel {
  return (
    typeof object === 'object' &&
    object !== null &&
    'json' in object &&
    object.json !== null &&
    typeof object.json === 'object' &&
    'ns' in object &&
    object.ns !== null &&
    typeof object.ns === 'object' &&
    'content' in object &&
    Array.isArray(object.content) &&
    object.content.every(isEObject)
  );
}

export function isEObject(object: unknown): object is EObject {
  return typeof object === 'object' && object !== null && 'eClass' in object;
}

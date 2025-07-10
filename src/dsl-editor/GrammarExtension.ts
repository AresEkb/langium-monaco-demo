import type { AstNode, Reference, ValueType } from 'langium';
import { isAstNode, isReference } from 'langium';

export type GrammarExtension = Record<string, Record<string, PropertyExtension>>;

export interface PropertyExtension {
  normalize?: (node: IdAstNode) => IdAstNode;
  denormalize?: (node: IdAstNode) => IdAstNode;
  scopes?: (node: IdAstNode) => IdAstNode[];
  parse?: (value: string) => ValueType;
  print?: (value: ValueType) => string;
}

export interface IdAstNode extends AstNode {
  $id?: string;
}

export interface IdReference<T extends AstNode = AstNode> extends Reference<T> {
  $id?: string;
}

export function isEntityAstNode(obj: unknown): obj is IdAstNode {
  return isAstNode(obj) && !obj.$type.includes('__');
}

export function isEnumLiteralAstNode(obj: unknown): obj is AstNode {
  return isAstNode(obj) && obj.$type.includes('__');
}

export function isReferenceAstNode(obj: unknown): obj is IdReference<IdAstNode> {
  return isReference(obj);
}

export function isValueType(obj: unknown): obj is ValueType {
  const type = typeof obj;
  return type === 'string' || type === 'number' || type === 'boolean' || type === 'bigint' || obj instanceof Date;
}

export function isValueTypeArray(obj: unknown[]): obj is ValueType[] {
  return obj.every(isValueType);
}

export function parseGrammarExtension(grammarExtension?: string): GrammarExtension {
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  return grammarExtension ? (new Function('return ' + grammarExtension) as () => GrammarExtension)() : {};
}

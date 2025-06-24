import { AstNode, isAstNode, isReference, Reference, ValueType } from 'langium';

export type GrammarExtension = Record<string, Record<string, PropertyExtension>>;

export interface PropertyExtension {
  normalize?: (node: IdAstNode) => IdAstNode;
  denormalize?: (node: IdAstNode) => IdAstNode;
  parse?: (value: string) => ValueType;
  print?: (value: ValueType) => string;
  scopes?: (node: IdAstNode) => IdAstNode[];
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

export function parseGrammarExtension(grammarExtension?: string): GrammarExtension {
  return grammarExtension ? new Function('return ' + grammarExtension)() : {};
}

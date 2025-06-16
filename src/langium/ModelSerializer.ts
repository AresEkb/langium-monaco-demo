import { AstNode, Grammar, GrammarAST, isAstNode, isReference } from 'langium';
import { EFeatureType, EModel, EObject, isEObject } from './Model';

export class ModelSerializer {
  serialize(node: AstNode, options: ModelSerializeOptions): EModel {
    return {
      json: {
        version: '1.0',
        encoding: 'utf-8',
      },
      ns: options.namespaces,
      content: [this.serializeNode(node, Object.keys(options.namespaces)[0])],
    };
  }

  private serializeNode(node: IdAstNode, namespacePrefix: string): EObject {
    const pos = node.$type.indexOf('_');
    const eClass =
      pos >= 0
        ? node.$type.substring(0, pos).toLowerCase() + ':' + node.$type.substring(pos + 1)
        : namespacePrefix + ':' + node.$type;
    if (node.$id === undefined) {
      throw new Error();
    }
    return {
      id: node.$id,
      eClass,
      data: Object.fromEntries(
        Object.entries(node)
          .filter(([name]) => !name.startsWith('$'))
          .map(([name, value]) => [name, this.serializeValue(value, namespacePrefix)]),
      ),
    };
  }

  private serializeValue(node: unknown, namespacePrefix: string): EFeatureType | EFeatureType[] {
    if (typeof node === 'string' || typeof node === 'number' || typeof node === 'boolean') {
      return node;
    }
    if (Array.isArray(node)) {
      return node.map((value) => this.serializeValue(value, namespacePrefix) as EFeatureType);
    }
    if (isIdAstNode(node)) {
      // It's a enum literal
      const pos = node.$type.indexOf('__');
      if (pos >= 0) {
        return node.$type.substring(pos + 2);
      }
      // It's an object
      return this.serializeNode(node, namespacePrefix);
    }
    if (isReference(node)) {
      if (!node.ref) {
        throw new Error(`Unresolved reference ${node.$refText}`);
      }
      if (!('$id' in node.ref)) {
        throw new Error();
      }
      return node.ref.$id as string;
    }
    throw new Error(`Unsupported value of type ${typeof node}`);
  }

  deserialize<T extends AstNode = AstNode>(model: EModel, options: ModelDeserializeOptions): T {
    const objects = new Map<string, EObject>();
    fillObjectMap(model.content[0], objects);
    function getObject(id: string) {
      const obj = objects.get(id);
      if (!obj) {
        throw new Error(`Object ${id} not found`);
      }
      return obj;
    }
    return this.deserializeNode(model.content[0], getObject, Object.keys(model.ns)[0], options.grammar) as T;
  }

  private deserializeNode(
    node: EObject,
    getObject: (id: string) => EObject,
    namespacePrefix: string,
    grammar: Grammar,
  ): IdAstNode {
    const [prefix, cls] = node.eClass.split(':', 2);
    const type = prefix === namespacePrefix ? cls : prefix + '_' + cls;
    const rule = grammar.rules.find((r) => GrammarAST.isParserRule(r) && r.name.toLowerCase() === type.toLowerCase());
    if (!rule) {
      throw new Error(`Rule not found for ${type}`);
    }
    return {
      $id: node.id,
      $type: rule.name,
      ...Object.fromEntries(
        Object.entries(node.data).map(([name, value]) => [
          name,
          this.deserializeValue(value, getObject, namespacePrefix, grammar, findElement(rule.definition, name)),
        ]),
      ),
    };
  }

  private deserializeValue(
    node: EFeatureType | EFeatureType[],
    getObject: (id: string) => EObject,
    namespacePrefix: string,
    grammar: Grammar,
    element?: GrammarAST.AbstractElement,
  ): unknown {
    if (node === undefined || node === null) {
      return node;
    }
    if (typeof node === 'string') {
      if (GrammarAST.isRuleCall(element)) {
        if (GrammarAST.isParserRule(element.rule.ref)) {
          return { $type: element.rule.ref.name + '__' + node };
        }
      }
      if (GrammarAST.isCrossReference(element)) {
        return { $refText: getObject(node).data.name };
      }
      return node;
    }
    if (typeof node === 'number' || typeof node === 'boolean') {
      return node;
    }
    if (Array.isArray(node)) {
      return node.map((value) => this.deserializeValue(value, getObject, namespacePrefix, grammar, element));
    }
    if (isEObject(node)) {
      return this.deserializeNode(node, getObject, namespacePrefix, grammar);
    }
    console.error(node);
    throw new Error(`Unsupported value of type ${typeof node}`);
  }
}

function fillObjectMap(node: unknown, objects: Map<string, EObject>) {
  if (Array.isArray(node)) {
    for (const value of node) {
      fillObjectMap(value, objects);
    }
  }
  if (isEObject(node)) {
    objects.set(node.id, node);
    for (const value of Object.values(node.data)) {
      fillObjectMap(value, objects);
    }
  }
}

function findElement(element: GrammarAST.AbstractElement, name: string): GrammarAST.AbstractElement | undefined {
  if (GrammarAST.isGroup(element) || GrammarAST.isAlternatives(element)) {
    for (const el of element.elements) {
      const value = findElement(el, name);
      if (value !== undefined) {
        return value;
      }
    }
    return;
  }
  if (GrammarAST.isAssignment(element)) {
    if (element.feature === name) {
      if (GrammarAST.isRuleCall(element.terminal)) {
        return element.terminal;
      }
      if (GrammarAST.isCrossReference(element.terminal)) {
        return element.terminal;
      }
    }
    return;
  }
  if (GrammarAST.isRuleCall(element)) {
    if (element.rule.ref) {
      return findElement(element.rule.ref?.definition, name);
    }
    return;
  }
  if (GrammarAST.isAction(element) || GrammarAST.isKeyword(element)) {
    return;
  }
  throw new Error(`Unsupported ${element.$type}`);
}

export interface ModelSerializeOptions {
  namespaces: Record<string, string>;
}

export interface ModelDeserializeOptions {
  grammar: Grammar;
}

export interface IdAstNode extends AstNode {
  $id?: string;
}

export function isIdAstNode(obj: unknown): obj is IdAstNode {
  return isAstNode(obj);
}

import type { AstNode, Grammar, ValueType } from 'langium';
import { GrammarAST } from 'langium';

import type { GrammarExtension, IdAstNode } from '../dsl-editor/GrammarExtension';
import { isEntityAstNode, isEnumLiteralAstNode, isReferenceAstNode } from '../dsl-editor/GrammarExtension';

import type { EFeatureType, EModel, EObject } from './Model';
import { isEObject } from './Model';

export class ModelSerializer {
  serialize(node: AstNode, options: ModelSerializeOptions): EModel {
    const nodes = new Map<string, IdAstNode>();
    fillAstNodeMap(node, nodes);
    function getAstNode(id: string) {
      const obj = nodes.get(id);
      if (!obj) {
        throw new Error(`AST node ${id} not found`);
      }
      return obj;
    }
    return {
      json: {
        version: '1.0',
        encoding: 'utf-8',
      },
      ns: options.namespaces,
      content: [serializeNode(node, getAstNode, Object.keys(options.namespaces)[0])],
    };
  }

  deserialize(model: EModel, options: ModelDeserializeOptions): AstNode {
    const objects = new Map<string, EObject>();
    fillObjectMap(model.content[0], objects);
    function getObject(id: string) {
      const obj = objects.get(id);
      if (!obj) {
        throw new Error(`Object ${id} not found`);
      }
      return obj;
    }
    return deserializeNode(model.content[0], getObject, Object.keys(options.namespaces)[0], options.grammar) as AstNode;
  }
}

export interface ModelSerializeOptions {
  namespaces: Record<string, string>;
  grammarExtension?: GrammarExtension;
}

export interface ModelDeserializeOptions {
  namespaces: Record<string, string>;
  grammar: Grammar;
  grammarExtension?: GrammarExtension;
}

function serializeNode(node: IdAstNode, getAstNode: (id: string) => IdAstNode, namespacePrefix: string): EObject {
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    data: Object.fromEntries(
      Object.entries(node)
        .filter(([name]) => !name.startsWith('$'))
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        .map(([name, value]) => [name, serializeValue(value, getAstNode, namespacePrefix)])
        .filter(([, value]) => value !== undefined && (!Array.isArray(value) || value.length)),
    ),
  };
}

function serializeValue(
  node: ValueType | undefined,
  getAstNode: (id: string) => IdAstNode,
  namespacePrefix: string,
): EFeatureType | EFeatureType[] | undefined {
  if (node === undefined || typeof node === 'string' || typeof node === 'number' || typeof node === 'boolean') {
    return node;
  }
  if (Array.isArray(node)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return node.map((value) => serializeValue(value, getAstNode, namespacePrefix) as EFeatureType);
  }
  if (isEntityAstNode(node)) {
    return serializeNode(node, getAstNode, namespacePrefix);
  }
  if (isEnumLiteralAstNode(node)) {
    return node.$type.substring(node.$type.indexOf('__') + 2);
  }
  if (isReferenceAstNode(node)) {
    if (node.$id === undefined) {
      throw new Error();
    }
    return node.$id;
  }
  throw new Error(`Unsupported value of type ${typeof node}`);
}

function deserializeNode(
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
  if (GrammarAST.isInfixRule(rule)) {
    throw new Error('Infix rules not supported yet');
  }
  return {
    $id: node.id,
    $type: rule.name,
    ...Object.fromEntries(
      Object.entries(node.data).map(([name, value]) => [
        name,
        deserializeValue(value, getObject, namespacePrefix, grammar, findElement(rule.definition, name)),
      ]),
    ),
  };
}

function deserializeValue(
  node: EFeatureType | EFeatureType[] | undefined | null,
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
        if (element.rule.ref.dataType) {
          return node;
        }
        return { $type: element.rule.ref.name + '__' + node };
      }
    }
    if (GrammarAST.isCrossReference(element)) {
      return { $refText: getObject(node).data.name as string };
    }
    return node;
  }
  if (typeof node === 'number' || typeof node === 'boolean') {
    return node;
  }
  if (Array.isArray(node)) {
    return node.map((value) => deserializeValue(value, getObject, namespacePrefix, grammar, element));
  }
  if (isEObject(node)) {
    return deserializeNode(node, getObject, namespacePrefix, grammar);
  }
  console.error(node);
  throw new Error(`Unsupported value of type ${typeof node}`);
}

function fillAstNodeMap(node: unknown, nodes: Map<string, IdAstNode>) {
  if (Array.isArray(node)) {
    for (const value of node) {
      fillAstNodeMap(value, nodes);
    }
  } else if (isEntityAstNode(node)) {
    if (!node.$id) {
      throw new Error();
    }
    nodes.set(node.$id, node);
    for (const [name, value] of Object.entries(node)) {
      if (!name.startsWith('$')) {
        fillAstNodeMap(value, nodes);
      }
    }
  }
}

function fillObjectMap(node: unknown, objects: Map<string, EObject>) {
  if (Array.isArray(node)) {
    for (const value of node) {
      fillObjectMap(value, objects);
    }
  } else if (isEObject(node)) {
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
      if (GrammarAST.isInfixRule(element.rule.ref)) {
        throw new Error('Infix rules not supported yet');
      }
      return findElement(element.rule.ref.definition, name);
    }
    return;
  }
  if (GrammarAST.isAction(element) || GrammarAST.isKeyword(element)) {
    return;
  }
  throw new Error(`Unsupported ${element.$type}`);
}

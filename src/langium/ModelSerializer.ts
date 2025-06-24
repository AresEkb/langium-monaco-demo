import { AstNode, Grammar, GrammarAST } from 'langium';
import {
  GrammarExtension,
  IdAstNode,
  isEntityAstNode,
  isEnumLiteralAstNode,
  isReferenceAstNode,
} from './GrammarExtension';
import { EFeatureType, EModel, EObject, isEObject } from './Model';

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
    return deserializeNode(model.content[0], getObject, Object.keys(model.ns)[0], options.grammar) as T;
  }
}

export interface ModelSerializeOptions {
  namespaces: Record<string, string>;
  grammarExtension?: GrammarExtension;
}

export interface ModelDeserializeOptions {
  grammar: Grammar;
  grammarExtension?: GrammarExtension;
}

function serializeNode(node: IdAstNode, getAstNode: (id: string) => IdAstNode, namespacePrefix: string): EObject {
  // const toModel = grammarExtension[node.$type]?.toModel;
  // const normalizedNode = toModel ? toModel(node) : node;
  const normalizedNode = node;
  const pos = normalizedNode.$type.indexOf('_');
  const eClass =
    pos >= 0
      ? normalizedNode.$type.substring(0, pos).toLowerCase() + ':' + normalizedNode.$type.substring(pos + 1)
      : namespacePrefix + ':' + normalizedNode.$type;
  if (normalizedNode.$id === undefined) {
    throw new Error();
  }
  return {
    id: normalizedNode.$id,
    eClass,
    data: Object.fromEntries(
      Object.entries(normalizedNode)
        .filter(([name]) => !name.startsWith('$'))
        .map(([name, value]) => [name, serializeValue(value, getAstNode, namespacePrefix)])
        .filter(([, value]) => value !== undefined),
    ),
  };
}

function serializeValue(
  node: unknown,
  getAstNode: (id: string) => IdAstNode,
  namespacePrefix: string,
): EFeatureType | EFeatureType[] | undefined {
  if (node === undefined || typeof node === 'string' || typeof node === 'number' || typeof node === 'boolean') {
    return node;
  }
  if (Array.isArray(node)) {
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
    return node.$id as string;
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
  const result: IdAstNode = {
    $id: node.id,
    $type: rule.name,
    ...Object.fromEntries(
      Object.entries(node.data).map(([name, value]) => [
        name,
        deserializeValue(value, getObject, namespacePrefix, grammar, findElement(rule.definition, name)),
      ]),
    ),
  };
  // const toAst = processors[result.$type]?.toAst;
  // return toAst ? toAst(result) : result;
  return result;
}

function deserializeValue(
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
      return findElement(element.rule.ref?.definition, name);
    }
    return;
  }
  if (GrammarAST.isAction(element) || GrammarAST.isKeyword(element)) {
    return;
  }
  throw new Error(`Unsupported ${element.$type}`);
}

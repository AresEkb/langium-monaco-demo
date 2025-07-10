import type { AstNode, Grammar } from 'langium';
import { GrammarAST, isAstNode, isReference } from 'langium';

import { isValueType } from './GrammarExtension';
import type { GrammarExtension } from './GrammarExtension';

class AstNodePropertyGetter {
  private node;
  private indices;

  constructor(object: AstNode) {
    this.node = object;
    this.indices = new Map<string, number>();
  }

  type() {
    return this.node.$type;
  }

  get(property: string): unknown {
    const value = (this.node as unknown as Record<string, unknown>)[property];
    if (!Array.isArray(value)) {
      return value;
    }
    const index = this.indices.get(property) ?? 0;
    this.indices.set(property, index + 1);
    return value[index];
  }
}

export function printAst(node: AstNode, grammar: Grammar, grammarExtension?: GrammarExtension): string {
  const rule = grammar.rules.find((r) => GrammarAST.isParserRule(r) && r.name === node.$type);
  if (!rule) {
    throw new Error(`Rule not found for ${node.$type}`);
  }
  const result = printElement(new AstNodePropertyGetter(node), grammar, grammarExtension ?? {}, rule.definition);
  return indent(result?.trim().replace(/[ ]+$/gm, '') ?? '') + '\n';
}

function printElement(
  node: AstNodePropertyGetter,
  grammar: Grammar,
  grammarExtension: GrammarExtension,
  element: GrammarAST.AbstractElement,
): string | undefined {
  if (GrammarAST.isGroup(element)) {
    return repeat(node, grammar, grammarExtension, element, printGroup);
  }
  if (GrammarAST.isAlternatives(element)) {
    return repeat(node, grammar, grammarExtension, element, printAlternatives);
  }
  if (GrammarAST.isAssignment(element)) {
    return repeat(node, grammar, grammarExtension, element, printAssignment);
  }
  if (GrammarAST.isRuleCall(element)) {
    if (element.rule.ref?.name === '_NL') {
      return '\n';
    }
    if (element.rule.ref?.fragment || node.type() === element.rule.ref?.name) {
      return repeat(node, grammar, grammarExtension, element.rule.ref.definition, printElement, element.cardinality);
    }
    return undefined;
  }
  if (GrammarAST.isAction(element)) {
    return node.type() === element.inferredType?.name ? '' : undefined;
  }
  if (GrammarAST.isKeyword(element)) {
    return element.value;
  }
  throw new Error(`Unsupported ${element.$type}`);
}

function printGroup(
  node: AstNodePropertyGetter,
  grammar: Grammar,
  grammarExtension: GrammarExtension,
  element: GrammarAST.Group,
): string | undefined {
  const results: string[] = [];
  for (const el of element.elements) {
    const value = printElement(node, grammar, grammarExtension, el);
    if (value === undefined) {
      return undefined;
    }
    results.push(value);
  }
  return join(results);
}

function printAlternatives(
  node: AstNodePropertyGetter,
  grammar: Grammar,
  grammarExtension: GrammarExtension,
  element: GrammarAST.Alternatives,
): string | undefined {
  for (const el of element.elements) {
    const value = printElement(node, grammar, grammarExtension, el);
    if (value !== undefined) {
      return value;
    }
  }
  return undefined;
}

function printAssignment(
  node: AstNodePropertyGetter,
  grammar: Grammar,
  grammarExtension: GrammarExtension,
  element: GrammarAST.Assignment,
): string | undefined {
  if (GrammarAST.isRuleCall(element.terminal)) {
    const value = node.get(element.feature);
    if (value === undefined || value === null) {
      return undefined;
    }
    if (GrammarAST.isParserRule(element.terminal.rule.ref)) {
      if (element.terminal.rule.ref.dataType) {
        if (!isValueType(value)) {
          throw new Error('Expected a value type');
        }
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        const print = grammarExtension[element.terminal.rule.ref.name]?.value.print;
        if (print) {
          return print(value);
        }
        if (element.terminal.rule.ref.dataType === 'number') {
          return value.toString();
        }
        throw new Error(`Unsupported value with type ${typeof value}`);
      } else {
        if (!isAstNode(value)) {
          throw new Error(`Expected AST node but got value with type ${typeof value}`);
        }
        return printElement(
          new AstNodePropertyGetter(value),
          grammar,
          grammarExtension,
          element.terminal.rule.ref.definition,
        );
      }
    }
    if (GrammarAST.isTerminalRule(element.terminal.rule.ref)) {
      if (typeof value === 'string') {
        if (element.terminal.rule.ref.name === 'STRING') {
          return (
            "'" +
            value
              .replace('\\', '\\\\')
              .replace('\b', '\\b')
              .replace('\f', '\\f')
              .replace('\n', '\\n')
              .replace('\r', '\\r')
              .replace('\t', '\\t')
              .replace('\v', '\\v')
              .replace("'", "\\'") +
            "'"
          );
        }
        return value;
      }
      if (typeof value === 'number') {
        return value.toString();
      }
      throw new Error(`Unsupported value with type ${typeof value}`);
    }
    throw new Error();
  }
  if (GrammarAST.isCrossReference(element.terminal)) {
    const value = node.get(element.feature);
    if (value === undefined) {
      return undefined;
    }
    if (!isReference(value)) {
      throw new Error(`Expected cross-reference but got value with type ${typeof value}`);
    }
    return value.$refText;
  }
  throw new Error(`Unsupported terminal ${element.terminal.$type}`);
}

const MAX_REPEAT_COUNT = 10000;

function repeat<T extends GrammarAST.AbstractElement>(
  node: AstNodePropertyGetter,
  grammar: Grammar,
  grammarExtension: GrammarExtension,
  element: T,
  func: (
    node: AstNodePropertyGetter,
    grammar: Grammar,
    grammarExtension: GrammarExtension,
    element: T,
  ) => string | undefined,
  cardinality?: '*' | '+' | '?',
) {
  const results: string[] = [];
  const many = cardinality === '*' || cardinality === '+' || element.cardinality === '*' || element.cardinality === '+';
  let i = 0;
  do {
    const value = func(node, grammar, grammarExtension, element);
    if (value === undefined) {
      break;
    }
    if (i++ >= MAX_REPEAT_COUNT) {
      throw new Error();
    }
    results.push(value);
  } while (many);
  const optional =
    cardinality === '?' || cardinality === '*' || element.cardinality === '?' || element.cardinality === '*';
  return results.length || optional ? join(results) : undefined;
}

function join(strings: string[]) {
  let result = '';
  for (const str of strings) {
    if (
      !result.length ||
      result.endsWith('\n') ||
      result.endsWith('(') ||
      result.endsWith('[') ||
      result.endsWith('.') ||
      str.startsWith(',') ||
      str.startsWith('.') ||
      str.startsWith('(') ||
      str.startsWith(')') ||
      str.startsWith('[') ||
      str.startsWith(']')
    ) {
      result += str;
    } else if (str) {
      result += ' ' + str;
    }
  }
  return result;
}

function indent(str: string) {
  let result = '';
  let depth = 0;
  for (let i = 0; i < str.length; i++) {
    result += str[i];
    if (str[i] === '{') {
      depth++;
    } else if (str[i] === '}') {
      depth--;
    } else if (str[i] === '\n' && str[i + 1] !== '\n' && str[i + 1] !== '}') {
      result += '    '.repeat(depth);
    }
  }
  return result;
}

import type { DiffPatcher } from 'jsondiffpatch';
import { create as createJsonDiffPatch } from 'jsondiffpatch';
import type { AstNode, LangiumDocument, ValueType } from 'langium';
import { v7 as uuidv7 } from 'uuid';
import type { Diagnostic } from 'vscode-languageserver';
import { NotificationType, Range, TextEdit, uinteger } from 'vscode-languageserver';

import { AbstractDslServer } from '../dsl-editor/AbstractDslServer';
import type { GrammarExtension, IdAstNode } from '../dsl-editor/GrammarExtension';
import { isEntityAstNode, isReferenceAstNode } from '../dsl-editor/GrammarExtension';
import { printAst } from '../dsl-editor/print';

import type { EModel } from './Model';
import { ModelSerializer } from './ModelSerializer';

export interface DslModelChange {
  uri: string;
  model: EModel;
  diagnostics: Diagnostic[];
}
export const dslModelChangeNotification: NotificationType<DslModelChange> = new NotificationType<DslModelChange>(
  'dsl/ModelChange',
);

export interface DslSetModel {
  uri: string;
  value: EModel;
}
export const dslSetModelNotification: NotificationType<DslSetModel> = new NotificationType<DslSetModel>('dsl/SetModel');

export class DslModelServer extends AbstractDslServer {
  private namespaces: Record<string, string>;
  private modelSerializer: ModelSerializer;
  private jsonDiffPatch: DiffPatcher;
  private asts: WeakMap<LangiumDocument, AstNode>;

  constructor(
    language: string,
    grammar: string,
    grammarExtension: string | undefined,
    namespaces: Record<string, string>,
  ) {
    super(language, grammar, grammarExtension);
    this.namespaces = namespaces;
    this.modelSerializer = new ModelSerializer();
    this.jsonDiffPatch = createJsonDiffPatch({
      propertyFilter(name) {
        return name !== '$id';
      },
    });
    this.asts = new WeakMap<LangiumDocument, AstNode>();

    this.connection.onNotification(dslSetModelNotification, (params) => {
      const ast = new ModelSerializer().deserialize(params.value, {
        grammar: this.grammar,
        grammarExtension: this.grammarExtension,
      });
      const denormalizedAst = transformNode(ast, this.grammarExtension, 'denormalize');
      const text = printAst(denormalizedAst, this.grammar, this.grammarExtension);
      void this.connection.workspace.applyEdit({
        changes: {
          [params.uri]: [TextEdit.replace(Range.create(0, 0, uinteger.MAX_VALUE, 0), text)],
        },
      });
    });
  }

  protected override onChange(document: LangiumDocument): void {
    const oldAst = this.asts.get(document);
    const newAst = JSON.parse(this.jsonSerializer.serialize(document.parseResult.value, { refText: true })) as AstNode;
    const astDelta = this.jsonDiffPatch.diff(oldAst, newAst);
    const updatedAst = this.jsonDiffPatch.patch(oldAst, astDelta) as AstNode;
    assignIds(updatedAst);
    this.asts.set(document, updatedAst);

    copyIds(updatedAst, document.parseResult.value);
    assignRefIds(document.parseResult.value);
    const normalizedAst = transformNode(document.parseResult.value, this.grammarExtension, 'normalize');
    const model = this.modelSerializer.serialize(normalizedAst, {
      namespaces: this.namespaces,
      grammarExtension: this.grammarExtension,
    });

    const params: DslModelChange = {
      uri: document.uri.toString(),
      model,
      diagnostics: document.diagnostics ?? [],
    };
    void this.connection.sendNotification(dslModelChangeNotification, params);
  }

  setModel(uri: string, value: EModel): void {
    const ast = this.modelSerializer.deserialize(value, {
      grammar: this.grammar,
      grammarExtension: this.grammarExtension,
    });
    const denormalizedAst = transformNode(ast, this.grammarExtension, 'denormalize');
    const text = printAst(denormalizedAst, this.grammar, this.grammarExtension);
    this.setValue(uri, text);
  }
}

function assignIds(node: unknown): void {
  if (Array.isArray(node)) {
    node.forEach((value) => assignIds(value));
  } else if (isEntityAstNode(node)) {
    node.$id ??= uuidv7();
    for (const [name, value] of Object.entries(node)) {
      if (!name.startsWith('$')) {
        assignIds(value);
      }
    }
  }
}

function assignRefIds(node: unknown): void {
  if (Array.isArray(node)) {
    node.forEach((value) => assignRefIds(value));
  } else if (isEntityAstNode(node)) {
    for (const [name, value] of Object.entries(node)) {
      if (!name.startsWith('$')) {
        assignRefIds(value);
      }
    }
  } else if (isReferenceAstNode(node)) {
    node.$id = node.ref?.$id;
  }
}

function copyIds(originalNode: unknown, node: unknown): void {
  if (Array.isArray(node)) {
    if (!Array.isArray(originalNode)) {
      throw new Error();
    }
    node.forEach((value, i) => copyIds(originalNode[i], value));
  } else if (isEntityAstNode(node)) {
    if (!isEntityAstNode(originalNode)) {
      throw new Error();
    }
    if (originalNode.$type !== node.$type) {
      throw new Error();
    }
    node.$id = originalNode.$id;
    for (const [name, value] of Object.entries(node)) {
      if (!name.startsWith('$')) {
        if (!(name in originalNode)) {
          throw new Error();
        }
        copyIds(originalNode[name as keyof typeof originalNode], value);
      }
    }
  }
}

type TransformationName = 'normalize' | 'denormalize';

export function transformNode(
  node: IdAstNode,
  grammarExtension: GrammarExtension,
  transformationName: TransformationName,
): IdAstNode {
  const result = {
    $id: node.$id,
    $type: node.$type,
    ...Object.fromEntries(
      Object.entries(node)
        .filter(([name]) => !name.startsWith('$'))
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        .map(([name, value]) => [name, transformValue(value, grammarExtension, transformationName)]),
    ),
  } as IdAstNode & Record<string, unknown>;
  for (const [propertyName, propertyExtension] of Object.entries(grammarExtension[node.$type] ?? {})) {
    if (propertyExtension[transformationName]) {
      result[propertyName] = propertyExtension[transformationName](result);
      if (result[propertyName] === undefined) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete result[propertyName];
      }
    }
  }
  return result;
}

function transformValue(
  node: ValueType,
  grammarExtension: GrammarExtension,
  transformationName: TransformationName,
): IdAstNode | IdAstNode[] | ValueType | ValueType[] {
  if (Array.isArray(node)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return node.map((value) => transformValue(value, grammarExtension, transformationName)) as
      | IdAstNode[]
      | ValueType[];
  }
  if (isEntityAstNode(node)) {
    return transformNode(node, grammarExtension, transformationName);
  }
  return node;
}

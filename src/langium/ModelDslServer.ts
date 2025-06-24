import { create as createJsonDiffPatch, DiffPatcher } from 'jsondiffpatch';
import { AstNode, LangiumDocument, ValueType } from 'langium';
import { v7 as uuidv7 } from 'uuid';
import { AbstractDslServer } from './DslServer';
import { GrammarExtension, IdAstNode, isEntityAstNode, isReferenceAstNode } from './GrammarExtension';
import { EModel } from './Model';
import { ModelSerializer } from './ModelSerializer';
import { printAst } from './print';
import { ModelDocumentChange, modelDocumentChangeNotification } from './workerUtils';

export class ModelDslServer extends AbstractDslServer {
  private namespaces: Record<string, string>;
  private modelSerializer: ModelSerializer;
  private jsonDiffPatch: DiffPatcher;
  private asts: WeakMap<LangiumDocument<AstNode>, AstNode>;

  constructor(grammar: string, grammarExtension: string | undefined, namespaces: Record<string, string>) {
    super(grammar, grammarExtension);
    this.namespaces = namespaces;
    this.modelSerializer = new ModelSerializer();
    this.jsonDiffPatch = createJsonDiffPatch({
      propertyFilter(name) {
        return name !== '$id';
      },
    });
    this.asts = new WeakMap<LangiumDocument<AstNode>, AstNode>();
  }

  protected override onChange(document: LangiumDocument<AstNode>): void {
    if (!this.jsonSerializer) {
      throw new Error();
    }
    const oldAst = this.asts.get(document);
    const newAst = JSON.parse(this.jsonSerializer.serialize(document.parseResult.value, { refText: true }));
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

    const params: ModelDocumentChange = {
      uri: document.uri.toString(),
      model,
      diagnostics: document.diagnostics ?? [],
    };
    this.connection.sendNotification(modelDocumentChangeNotification, params);
  }

  setModel(uri: string, value: EModel) {
    if (!this.grammar) {
      throw new Error();
    }
    const ast = this.modelSerializer.deserialize(value, {
      grammar: this.grammar,
      grammarExtension: this.grammarExtension,
    });
    const denormalizedAst = transformNode(ast, this.grammarExtension, 'denormalize');
    const text = printAst(denormalizedAst, this.grammar);
    this.setValue(uri, text);
  }
}

function assignIds(node: unknown): void {
  if (Array.isArray(node)) {
    node.forEach((value) => assignIds(value));
  } else if (isEntityAstNode(node)) {
    if (!node.$id) {
      node.$id = uuidv7();
    }
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
  const result = Object.fromEntries(
    Object.entries(node)
      .filter(([name]) => !name.startsWith('$'))
      .map(([name, value]) => [name, transformValue(value, grammarExtension, transformationName)])
      .filter(([, value]) => value !== undefined),
  );
  for (const [name, value] of Object.entries(grammarExtension[node.$type] ?? {})) {
    if (value[transformationName]) {
      result[name] = value[transformationName](result);
    }
  }
  return { $id: node.$id, $type: node.$type, ...result };
}

function transformValue(
  node: ValueType,
  grammarExtension: GrammarExtension,
  transformationName: TransformationName,
): IdAstNode | IdAstNode[] | ValueType | ValueType[] {
  if (Array.isArray(node)) {
    return node.map((value) => transformValue(value, grammarExtension, transformationName)) as
      | IdAstNode[]
      | ValueType[];
  }
  if (isEntityAstNode(node)) {
    return transformNode(node, grammarExtension, transformationName);
  }
  return node;
}

// function normalizeNode(node: IdAstNode, grammarExtension: GrammarExtension): IdAstNode {
//   const result = Object.fromEntries(
//     Object.entries(node)
//       .filter(([name]) => !name.startsWith('$'))
//       .map(([name, value]) => [name, normalizeValue(value, grammarExtension)])
//       .filter(([, value]) => value !== undefined),
//   );
//   for (const [name, value] of Object.entries(grammarExtension[node.$type] ?? {})) {
//     if (value.normalize) {
//       result[name] = value.normalize(result);
//     }
//   }
//   return { $id: node.$id, $type: node.$type, ...result };
// }

// function normalizeValue(
//   node: ValueType,
//   grammarExtension: GrammarExtension,
// ): IdAstNode | IdAstNode[] | ValueType | ValueType[] {
//   if (Array.isArray(node)) {
//     return node.map((value) => normalizeValue(value, grammarExtension)) as IdAstNode[] | ValueType[];
//   }
//   if (isEntityAstNode(node)) {
//     return normalizeNode(node, grammarExtension);
//   }
//   return node;
// }

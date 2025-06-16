import { create as createJsonDiffPatch } from 'jsondiffpatch';
import { AstNode, DocumentState, Grammar, LangiumDocument } from 'langium';
import { createServicesForGrammar } from 'langium/grammar';
import { LangiumServices, startLanguageServer } from 'langium/lsp';
import { v7 as uuidv7 } from 'uuid';
import { Connection, DiagnosticSeverity, Range, TextEdit, uinteger } from 'vscode-languageserver';
import { EModel, isEModel } from './Model.js';
import { isIdAstNode, ModelSerializer } from './ModelSerializer.js';
import { printAst } from './print.js';
import {
  createServerConnection,
  DslCompletionProvider,
  ModelDocumentChange,
  modelDocumentChangeNotification,
} from './workerUtils.js';

addEventListener('message', async (event) => {
  if (event.data.type === 'start') {
    if (typeof event.data.grammar !== 'string') {
      throw new Error('Grammar should be a string');
    }
    if (event.data.namespaces === null || typeof event.data.namespaces !== 'object') {
      throw new Error('Namespaces should be a record');
    }
    await start(event.data.grammar, event.data.namespaces);
  } else if (event.data.type === 'setValue') {
    if (typeof event.data.uri !== 'string') {
      throw new Error('URI should be a string');
    }
    if (!isEModel(event.data.value)) {
      throw new Error('Value should be a model');
    }
    setValue(event.data.uri, event.data.value);
  }
});

let connection: Connection;
let grammar: Grammar;
const modelSerializer = new ModelSerializer();

async function start(grammarString: string, namespaces: Record<string, string>): Promise<void> {
  connection = createServerConnection();

  const { shared, serializer, Grammar } = await createServicesForGrammar({
    grammar: grammarString,
    module: {
      lsp: {
        CompletionProvider: (services: LangiumServices) => new DslCompletionProvider(services),
      },
    },
    sharedModule: {
      lsp: {
        Connection: () => connection,
      },
    },
  });

  grammar = Grammar;

  const oldAsts = new WeakMap<LangiumDocument<AstNode>, object>();

  const jsonDiffPatch = createJsonDiffPatch({
    propertyFilter(name) {
      return name !== '$id';
    },
  });

  shared.workspace.DocumentBuilder.onBuildPhase(DocumentState.Validated, (documents) => {
    for (const document of documents) {
      if (document.diagnostics?.some((d) => d.severity === DiagnosticSeverity.Error)) {
        continue;
      }

      const oldAst = oldAsts.get(document);
      const newAst = JSON.parse(serializer.JsonSerializer.serialize(document.parseResult.value, { refText: true }));
      const astDelta = jsonDiffPatch.diff(oldAst, newAst);
      const updatedAst = jsonDiffPatch.patch(oldAst, astDelta) as AstNode;
      assignIds(updatedAst);
      oldAsts.set(document, updatedAst);

      copyIds(updatedAst, document.parseResult.value);
      const model = modelSerializer.serialize(document.parseResult.value, { namespaces });

      const params: ModelDocumentChange = {
        uri: document.uri.toString(),
        model,
        diagnostics: document.diagnostics ?? [],
      };
      connection.sendNotification(modelDocumentChangeNotification, params);
    }
  });

  startLanguageServer(shared);
  postMessage({ type: 'started' });
}

function assignIds(node: unknown): void {
  if (Array.isArray(node)) {
    node.forEach((value) => assignIds(value));
  } else if (isIdAstNode(node)) {
    if (!node.$type.includes('__')) {
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
}

function copyIds(originalNode: unknown, node: unknown): void {
  if (Array.isArray(node)) {
    if (!Array.isArray(originalNode)) {
      throw new Error();
    }
    node.forEach((value, i) => copyIds(originalNode[i], value));
  } else if (isIdAstNode(node)) {
    if (!isIdAstNode(originalNode)) {
      throw new Error();
    }
    if (originalNode.$type !== node.$type) {
      throw new Error();
    }
    if (!node.$type.includes('__')) {
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
}

function setValue(uri: string, value: EModel) {
  const ast = modelSerializer.deserialize(value, { grammar });
  const text = printAst(ast, grammar);
  connection.workspace.applyEdit({
    changes: {
      [uri]: [TextEdit.replace(Range.create(0, 0, uinteger.MAX_VALUE, 0), text)],
    },
  });
}

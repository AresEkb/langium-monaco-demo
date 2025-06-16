import { DocumentState } from 'langium';
import { createServicesForGrammar } from 'langium/grammar';
import { LangiumServices, startLanguageServer } from 'langium/lsp';
import { Connection, DiagnosticSeverity, Range, TextEdit, uinteger } from 'vscode-languageserver';

import {
  createServerConnection,
  DocumentChange,
  documentChangeNotification,
  DslCompletionProvider,
} from './workerUtils.js';

addEventListener('message', async (event) => {
  if (event.data.type === 'start') {
    if (typeof event.data.grammar !== 'string') {
      throw new Error('Grammar should be a string');
    }
    await start(event.data.grammar, event.data.excludeText ?? false, event.data.includeAst ?? false);
  } else if (event.data.type === 'setValue') {
    if (typeof event.data.uri !== 'string') {
      throw new Error('URI should be a string');
    }
    if (typeof event.data.value !== 'string') {
      throw new Error('Value should be a string');
    }
    setValue(event.data.uri, event.data.value);
  }
});

let connection: Connection;

async function start(grammar: string, excludeText: boolean, includeAst: boolean): Promise<void> {
  connection = createServerConnection();

  const { shared, serializer } = await createServicesForGrammar({
    grammar,
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

  shared.workspace.DocumentBuilder.onBuildPhase(DocumentState.Validated, (documents) => {
    for (const document of documents) {
      if (document.diagnostics?.some((d) => d.severity === DiagnosticSeverity.Error)) {
        continue;
      }
      const params: DocumentChange = {
        uri: document.uri.toString(),
        diagnostics: document.diagnostics ?? [],
      };
      if (!excludeText) {
        params.text = document.textDocument.getText();
      }
      if (includeAst) {
        params.ast = JSON.parse(serializer.JsonSerializer.serialize(document.parseResult.value, { refText: true }));
      }
      connection.sendNotification(documentChangeNotification, params);
    }
  });

  startLanguageServer(shared);
  postMessage({ type: 'started' });
}

function setValue(uri: string, value: string) {
  connection.workspace.applyEdit({
    changes: {
      [uri]: [TextEdit.replace(Range.create(0, 0, uinteger.MAX_VALUE, 0), value)],
    },
  });
}

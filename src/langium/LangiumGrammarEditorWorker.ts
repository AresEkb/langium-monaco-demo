import { DocumentState, EmptyFileSystem } from 'langium';
import { createLangiumGrammarServices } from 'langium/grammar';
import { startLanguageServer } from 'langium/lsp';
import { createServerConnection, documentChangeNotification } from './workerUtils';

const connection = createServerConnection();
const { shared } = createLangiumGrammarServices({ connection, ...EmptyFileSystem });
startLanguageServer(shared);

shared.workspace.DocumentBuilder.onBuildPhase(DocumentState.Validated, (documents) => {
  for (const document of documents) {
    connection.sendNotification(documentChangeNotification, {
      uri: document.uri.toString(),
      text: document.textDocument.getText(),
      diagnostics: document.diagnostics ?? [],
    });
  }
});

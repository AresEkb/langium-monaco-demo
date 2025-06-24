import { DocumentState, EmptyFileSystem } from 'langium';
import { createLangiumGrammarServices } from 'langium/grammar';
import { startLanguageServer } from 'langium/lsp';
import { BrowserMessageReader, BrowserMessageWriter, createConnection } from 'vscode-languageserver/browser';
import { documentChangeNotification } from './workerUtils';

const messageReader = new BrowserMessageReader(self);
const messageWriter = new BrowserMessageWriter(self);
const connection = createConnection(messageReader, messageWriter);
const { shared } = createLangiumGrammarServices({ connection, ...EmptyFileSystem });

shared.workspace.DocumentBuilder.onBuildPhase(DocumentState.Validated, (documents) => {
  for (const document of documents) {
    connection.sendNotification(documentChangeNotification, {
      uri: document.uri.toString(),
      text: document.textDocument.getText(),
      diagnostics: document.diagnostics ?? [],
    });
  }
});

startLanguageServer(shared);

import { AstNode, GrammarAST } from 'langium';
import { CompletionContext, DefaultCompletionProvider } from 'langium/lsp';
import {
  BrowserMessageReader,
  BrowserMessageWriter,
  Connection,
  createConnection,
  Diagnostic,
  NotificationType,
} from 'vscode-languageserver/browser';
import { EModel } from './Model';

export const documentChange = 'browser/DocumentChange';

export interface DocumentChange {
  uri: string;
  text?: string;
  ast?: AstNode;
  diagnostics: Diagnostic[];
}

export const documentChangeNotification = new NotificationType<DocumentChange>(documentChange);

export const modelDocumentChange = 'browser/ModelDocumentChange';

export interface ModelDocumentChange {
  uri: string;
  model: EModel;
  diagnostics: Diagnostic[];
}

export const modelDocumentChangeNotification = new NotificationType<ModelDocumentChange>(modelDocumentChange);

export function createServerConnection(): Connection {
  const messageReader = new BrowserMessageReader(self);
  const messageWriter = new BrowserMessageWriter(self);
  return createConnection(messageReader, messageWriter);
}

export class DslCompletionProvider extends DefaultCompletionProvider {
  protected override filterKeyword(_context: CompletionContext, keyword: GrammarAST.Keyword): boolean {
    return keyword.value !== '__NL__';
  }
}

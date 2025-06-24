import { AstNode } from 'langium';
import { Diagnostic, NotificationType } from 'vscode-languageserver/browser';
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

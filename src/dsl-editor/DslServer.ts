import type { AstNode, LangiumDocument } from 'langium';
import type { Diagnostic } from 'vscode-languageserver/browser';
import { NotificationType } from 'vscode-languageserver/browser';

import { AbstractDslServer } from './AbstractDslServer';

export interface DslDocumentChange {
  uri: string;
  text?: string;
  ast?: AstNode;
  diagnostics: Diagnostic[];
}
export const dslDocumentChangeNotification: NotificationType<DslDocumentChange> =
  new NotificationType<DslDocumentChange>('dsl/DocumentChange');

export class DslServer extends AbstractDslServer {
  private excludeText: boolean;
  private includeAst: boolean;

  constructor(
    language: string,
    grammar: string,
    grammarExtension?: string,
    excludeText?: boolean,
    includeAst?: boolean,
  ) {
    super(language, grammar, grammarExtension);
    this.excludeText = excludeText ?? false;
    this.includeAst = includeAst ?? false;
  }

  protected override onChange(document: LangiumDocument): void {
    const params: DslDocumentChange = {
      uri: document.uri.toString(),
      diagnostics: document.diagnostics ?? [],
    };
    if (!this.excludeText) {
      params.text = document.textDocument.getText();
    }
    if (this.includeAst) {
      params.ast = JSON.parse(this.jsonSerializer.serialize(document.parseResult.value, { refText: true })) as AstNode;
    }
    void this.connection.sendNotification(dslDocumentChangeNotification, params);
  }
}

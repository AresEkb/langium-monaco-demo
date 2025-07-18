import type {
  AstNodeDescriptionProvider,
  CstNode,
  Grammar,
  GrammarAST,
  JsonSerializer,
  LangiumCoreServices,
  LangiumDocument,
  ReferenceInfo,
  Scope,
  ValueType} from 'langium';
import {
  DefaultScopeProvider,
  DefaultValueConverter,
  DocumentState,
  MapScope
} from 'langium';
import { createServicesForGrammar } from 'langium/grammar';
import type { CompletionContext , LangiumServices} from 'langium/lsp';
import { DefaultCompletionProvider, startLanguageServer } from 'langium/lsp';
import { generateTextMate } from 'langium-cli/textmate';
import type { Connection} from 'vscode-languageserver';
import { DiagnosticSeverity, NotificationType, Range, TextEdit, uinteger } from 'vscode-languageserver';
import { BrowserMessageReader, BrowserMessageWriter, createConnection } from 'vscode-languageserver/browser';

import type { GrammarExtension} from './GrammarExtension';
import { parseGrammarExtension } from './GrammarExtension';

export interface DslSetValue {
  uri: string;
  value: string;
}
export const dslSetValueNotification: NotificationType<DslSetValue> = new NotificationType<DslSetValue>('dsl/SetValue');

export abstract class AbstractDslServer {
  private _language: string;
  private _connection: Connection;
  private _grammar?: Grammar;
  private _grammarExtension: GrammarExtension;
  private _textmateGrammar?: string;
  private _jsonSerializer?: JsonSerializer;

  private _grammarString: string;

  constructor(language: string, grammar: string, grammarExtension?: string) {
    this._language = language;
    const messageReader = new BrowserMessageReader(self);
    const messageWriter = new BrowserMessageWriter(self);
    this._connection = createConnection(messageReader, messageWriter);
    this._grammarString = grammar;
    this._grammarExtension = parseGrammarExtension(grammarExtension);

    this._connection.onNotification(dslSetValueNotification, (params) => {
      void this._connection.workspace.applyEdit({
        changes: {
          [params.uri]: [TextEdit.replace(Range.create(0, 0, uinteger.MAX_VALUE, 0), params.value)],
        },
      });
    });
  }

  async start(): Promise<void> {
    const { shared, serializer, Grammar } = await createServicesForGrammar({
      grammar: this._grammarString,
      module: {
        parser: {
          ValueConverter: () => new DslValueConverter(this._grammarExtension),
        },
        references: {
          ScopeProvider: (services: LangiumServices) => new DslScopeProvider(services, this._grammarExtension),
        },
        lsp: {
          CompletionProvider: (services: LangiumServices) => new DslCompletionProvider(services),
        },
      },
      sharedModule: {
        lsp: {
          Connection: () => this._connection,
        },
      },
    });

    this._jsonSerializer = serializer.JsonSerializer;
    this._grammar = Grammar;

    this._textmateGrammar = generateTextMate(Grammar, { id: this._language, grammar: '' });

    shared.workspace.DocumentBuilder.onBuildPhase(DocumentState.Validated, (documents) => {
      for (const document of documents) {
        if (document.diagnostics?.some((d) => d.severity === DiagnosticSeverity.Error)) {
          continue;
        }
        this.onChange(document);
      }
    });

    startLanguageServer(shared);
  }

  protected abstract onChange(document: LangiumDocument): void;

  get connection(): Connection {
    return this._connection;
  }

  get grammar(): Grammar {
    if (this._grammar === undefined) {
      throw new Error();
    }
    return this._grammar;
  }

  get grammarExtension(): GrammarExtension {
    return this._grammarExtension;
  }

  get textmateGrammar(): string {
    if (this._textmateGrammar === undefined) {
      throw new Error();
    }
    return this._textmateGrammar;
  }

  get jsonSerializer(): JsonSerializer {
    if (this._jsonSerializer === undefined) {
      throw new Error();
    }
    return this._jsonSerializer;
  }

  setValue(uri: string, value: string): void {
    void this._connection.workspace.applyEdit({
      changes: {
        [uri]: [TextEdit.replace(Range.create(0, 0, uinteger.MAX_VALUE, 0), value)],
      },
    });
  }
}

class DslValueConverter extends DefaultValueConverter {
  private grammarExtension: GrammarExtension;

  constructor(grammarExtension: GrammarExtension) {
    super();
    this.grammarExtension = grammarExtension;
  }

  protected runConverter(rule: GrammarAST.AbstractRule, input: string, cstNode: CstNode): ValueType {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const parse = this.grammarExtension[rule.name]?.value.parse;
    if (parse) {
      return parse(input);
    }
    return super.runConverter(rule, input, cstNode);
  }
}

class DslScopeProvider extends DefaultScopeProvider {
  private astNodeDescriptionProvider: AstNodeDescriptionProvider;
  private grammarExtension: GrammarExtension;

  constructor(services: LangiumCoreServices, grammarExtension: GrammarExtension) {
    super(services);
    this.astNodeDescriptionProvider = services.workspace.AstNodeDescriptionProvider;
    this.grammarExtension = grammarExtension;
  }

  getScope(context: ReferenceInfo): Scope {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const scopes = this.grammarExtension[context.container.$type]?.[context.property]?.scopes;
    if (scopes) {
      return new MapScope(
        scopes(context.container).map((ref) => {
          if (!('name' in ref && typeof ref.name === 'string')) {
            throw new Error();
          }
          return this.astNodeDescriptionProvider.createDescription(ref, ref.name);
        }),
      );
    }
    return super.getScope(context);
  }
}

class DslCompletionProvider extends DefaultCompletionProvider {
  protected override filterKeyword(_context: CompletionContext, keyword: GrammarAST.Keyword): boolean {
    return keyword.value !== '__NL__';
  }
}

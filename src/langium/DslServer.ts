import {
  AstNode,
  AstNodeDescriptionProvider,
  CstNode,
  DefaultScopeProvider,
  DefaultValueConverter,
  DocumentState,
  Grammar,
  GrammarAST,
  JsonSerializer,
  LangiumCoreServices,
  LangiumDocument,
  MapScope,
  ReferenceInfo,
  Scope,
  ValueType,
} from 'langium';
import { createServicesForGrammar } from 'langium/grammar';
import { CompletionContext, DefaultCompletionProvider, LangiumServices, startLanguageServer } from 'langium/lsp';
import { Connection, DiagnosticSeverity, Range, TextEdit, uinteger } from 'vscode-languageserver';
import { BrowserMessageReader, BrowserMessageWriter, createConnection } from 'vscode-languageserver/browser';
import { GrammarExtension, parseGrammarExtension } from './GrammarExtension';
import { DocumentChange, documentChangeNotification } from './workerUtils';

export abstract class AbstractDslServer {
  protected connection: Connection;
  protected grammar?: Grammar;
  protected grammarExtension: GrammarExtension;
  protected jsonSerializer?: JsonSerializer;

  private grammarString: string;

  constructor(grammar: string, grammarExtension?: string) {
    const messageReader = new BrowserMessageReader(self);
    const messageWriter = new BrowserMessageWriter(self);
    this.connection = createConnection(messageReader, messageWriter);
    this.grammarString = grammar;
    this.grammarExtension = parseGrammarExtension(grammarExtension);
  }

  async start() {
    const { shared, serializer, Grammar } = await createServicesForGrammar({
      grammar: this.grammarString,
      module: {
        parser: {
          ValueConverter: () => new DslValueConverter(this.grammarExtension),
        },
        references: {
          ScopeProvider: (services: LangiumServices) => new DslScopeProvider(services, this.grammarExtension),
        },
        lsp: {
          CompletionProvider: (services: LangiumServices) => new DslCompletionProvider(services),
        },
      },
      sharedModule: {
        lsp: {
          Connection: () => this.connection,
        },
      },
    });

    this.jsonSerializer = serializer.JsonSerializer;
    this.grammar = Grammar;

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

  protected abstract onChange(document: LangiumDocument<AstNode>): void;

  setValue(uri: string, value: string) {
    this.connection.workspace.applyEdit({
      changes: {
        [uri]: [TextEdit.replace(Range.create(0, 0, uinteger.MAX_VALUE, 0), value)],
      },
    });
  }
}

export class DslServer extends AbstractDslServer {
  private excludeText: boolean;
  private includeAst: boolean;

  constructor(grammar: string, grammarExtension?: string, excludeText?: boolean, includeAst?: boolean) {
    super(grammar, grammarExtension);
    this.excludeText = excludeText ?? false;
    this.includeAst = includeAst ?? false;
  }

  protected override onChange(document: LangiumDocument<AstNode>) {
    const params: DocumentChange = {
      uri: document.uri.toString(),
      diagnostics: document.diagnostics ?? [],
    };
    if (!this.excludeText) {
      params.text = document.textDocument.getText();
    }
    if (this.includeAst) {
      if (!this.jsonSerializer) {
        throw new Error();
      }
      params.ast = JSON.parse(this.jsonSerializer.serialize(document.parseResult.value, { refText: true }));
    }
    this.connection.sendNotification(documentChangeNotification, params);
  }
}

// export async function createDslServer(grammar: string, grammarExtension?: string) {
//   const messageReader = new BrowserMessageReader(self);
//   const messageWriter = new BrowserMessageWriter(self);
//   const connection = createConnection(messageReader, messageWriter);

//   const extension = parseGrammarExtension(grammarExtension);

//   const { shared, serializer, Grammar } = await createServicesForGrammar({
//     grammar,
//     module: {
//       parser: {
//         ValueConverter: () => new DslValueConverter(extension),
//       },
//       references: {
//         ScopeProvider: (services: LangiumServices) => new DslScopeProvider(services, extension),
//       },
//       lsp: {
//         CompletionProvider: (services: LangiumServices) => new DslCompletionProvider(services),
//       },
//     },
//     sharedModule: {
//       lsp: {
//         Connection: () => connection,
//       },
//     },
//   });
//   return {
//     connection,
//     grammar: Grammar,
//     grammarExtension: extension,
//     shared,
//     jsonSerializer: serializer.JsonSerializer,
//   };
// }

class DslValueConverter extends DefaultValueConverter {
  private grammarExtension: GrammarExtension;

  constructor(grammarExtension: GrammarExtension) {
    super();
    this.grammarExtension = grammarExtension;
  }

  protected runConverter(rule: GrammarAST.AbstractRule, input: string, cstNode: CstNode): ValueType {
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

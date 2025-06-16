// import { create as createJsonDiffPatch } from 'jsondiffpatch';
// import { AstNode, DocumentState, GrammarAST, LangiumDocument } from 'langium';
// import { createServicesForGrammar } from 'langium/grammar';
// import { CompletionContext, DefaultCompletionProvider, LangiumServices, startLanguageServer } from 'langium/lsp';
// import { v7 as uuidv7 } from 'uuid';
// import { DiagnosticSeverity, NotificationType } from 'vscode-languageserver/browser.js';

// import { isIdAstNode, ModelSerializer } from './serializer.js';
// import { createServerConnection, DocumentChange } from './workerUtils.js';

// addEventListener('message', async (event) => {
//   if (event.data.type && event.data.type === 'startWithGrammar') {
//     if (event.data.grammar === undefined) {
//       throw new Error('DSL worker was started without a grammar');
//     }
//     if (event.data.namespaces === undefined) {
//       throw new Error('DSL worker was started without namespaces');
//     }
//     await startWithGrammar(event.data.grammar as string, event.data.namespaces as Record<string, string>);
//   }
// });

// const documentChangeNotification = new NotificationType<DocumentChange>('browser/DocumentChange');

// async function startWithGrammar(grammar: string, namespaces: Record<string, string>): Promise<void> {
//   const connection = createServerConnection();

//   const { shared, serializer, Grammar } = await createServicesForGrammar({
//     grammar,
//     module: {
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

//   const oldAsts = new WeakMap<LangiumDocument<AstNode>, object>();

//   const jsonDiffPatch = createJsonDiffPatch({
//     propertyFilter(name) {
//       return name !== '$id';
//     },
//   });

//   shared.workspace.DocumentBuilder.onBuildPhase(DocumentState.Validated, (documents) => {
//     for (const document of documents) {
//       if (document.diagnostics?.some((d) => d.severity === DiagnosticSeverity.Error)) {
//         continue;
//       }
//       const oldAst = oldAsts.get(document);
//       const newAst = JSON.parse(serializer.JsonSerializer.serialize(document.parseResult.value, { refText: true }));
//       const astDelta = jsonDiffPatch.diff(oldAst, newAst);
//       const updatedAst = jsonDiffPatch.patch(oldAst, astDelta) as AstNode;
//       assignIds(updatedAst);
//       oldAsts.set(document, updatedAst);

//       copyIds(updatedAst, document.parseResult.value);
//       const modelSerializer = new ModelSerializer();
//       const model = JSON.parse(modelSerializer.serialize(document.parseResult.value, { namespaces }));
//       const newAst2 = modelSerializer.deserialize(JSON.stringify(model), { namespaces, grammar: Grammar });
//       connection.sendNotification(documentChangeNotification, {
//         uri: document.uri.toString(),
//         content: JSON.stringify({ ast: updatedAst, astDelta, model, newAst: newAst2 }),
//         diagnostics: document.diagnostics ?? [],
//       });
//     }
//   });

//   startLanguageServer(shared);
//   postMessage({ type: 'lsStartedWithGrammar' });
// }

// function assignIds(node: unknown): void {
//   if (node instanceof Array) {
//     node.forEach((value) => assignIds(value));
//   } else if (isIdAstNode(node)) {
//     if (!node.$type.includes('__')) {
//       if (!node.$id) {
//         node.$id = uuidv7();
//       }
//       for (const [name, value] of Object.entries(node)) {
//         if (!name.startsWith('$')) {
//           assignIds(value);
//         }
//       }
//     }
//   }
// }

// function copyIds(originalNode: unknown, node: unknown): void {
//   if (node instanceof Array) {
//     if (!(originalNode instanceof Array)) {
//       throw new Error();
//     }
//     node.forEach((value, i) => copyIds(originalNode[i], value));
//   } else if (isIdAstNode(node)) {
//     if (!isIdAstNode(originalNode)) {
//       throw new Error();
//     }
//     if (originalNode.$type !== node.$type) {
//       throw new Error();
//     }
//     if (!node.$type.includes('__')) {
//       node.$id = originalNode.$id;
//       for (const [name, value] of Object.entries(node)) {
//         if (!name.startsWith('$')) {
//           if (!(name in originalNode)) {
//             throw new Error();
//           }
//           copyIds(originalNode[name as keyof typeof originalNode], value);
//         }
//       }
//     }
//   }
// }

// class DslCompletionProvider extends DefaultCompletionProvider {
//   protected override filterKeyword(_context: CompletionContext, keyword: GrammarAST.Keyword): boolean {
//     return keyword.value !== '__NL__';
//   }
// }

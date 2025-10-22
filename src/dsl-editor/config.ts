import type { ConnectionConfigOptions } from 'monaco-languageclient/common';
import type { EditorAppConfig } from 'monaco-languageclient/editorApp';
import type { LanguageClientConfig } from 'monaco-languageclient/lcwrapper';
import type { MonacoVscodeApiConfig } from 'monaco-languageclient/vscodeApiWrapper';
import { configureDefaultWorkerFactory } from 'monaco-languageclient/workerFactory';

export interface MonacoEditorReactConfig {
  vscodeApiConfig: MonacoVscodeApiConfig;
  languageClientConfig?: LanguageClientConfig;
  editorAppConfig: EditorAppConfig;
}

export function createConfig(
  uri: string,
  content: string,
  language: string,
  textmateGrammar: string,
  readOnly: boolean,
  connectionOptions: ConnectionConfigOptions,
): MonacoEditorReactConfig {
  const languageGrammarUrl = language + '-grammar.json';
  return {
    vscodeApiConfig: {
      $type: 'extended',
      viewsConfig: {
        $type: 'EditorService',
      },
      userConfiguration: {
        json: JSON.stringify({
          'editor.experimental.asyncTokenization': false,
          'editor.quickSuggestions': false,
          'editor.wordBasedSuggestions': 'off',
        }),
      },
      extensions: [
        {
          config: {
            name: language,
            publisher: 'Example.com',
            version: '1.0.0',
            engines: { vscode: '*' },
            contributes: {
              languages: [{ id: language }],
              grammars: [
                {
                  language,
                  scopeName: 'source.' + language,
                  path: languageGrammarUrl,
                },
              ],
            },
          },
          filesOrContents: new Map<string, string>([[languageGrammarUrl, textmateGrammar]]),
        },
      ],
      monacoWorkerFactory: configureDefaultWorkerFactory,
    },
    languageClientConfig: {
      languageId: language,
      connection: {
        options: connectionOptions,
      },
      clientOptions: {
        documentSelector: [language],
      },
    },
    editorAppConfig: {
      codeResources: {
        modified: {
          text: content,
          enforceLanguageId: language,
          uri,
        },
      },
      editorOptions: {
        readOnly,
      },
    },
  };
}

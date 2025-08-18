import { LogLevel } from '@codingame/monaco-vscode-api';
import type { WrapperConfig } from 'monaco-editor-wrapper';
import { configureDefaultWorkerFactory } from 'monaco-editor-wrapper/workers/workerLoaders';
import type { ConnectionConfigOptions } from 'monaco-languageclient';

export function createConfig(
  uri: string,
  content: string,
  language: string,
  textmateGrammar: string,
  readOnly: boolean,
  connectionOptions: ConnectionConfigOptions,
): WrapperConfig {
  const languageGrammarUrl = language + '-grammar.json';
  return {
    $type: 'extended',
    logLevel: LogLevel.Warning,
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
    vscodeApiConfig: {
      userConfiguration: {
        json: JSON.stringify({
          'editor.experimental.asyncTokenization': false,
          'editor.quickSuggestions': false,
          'editor.wordBasedSuggestions': 'off',
        }),
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
      monacoWorkerFactory: configureDefaultWorkerFactory,
    },
    languageClientConfigs: {
      configs: {
        [language]: {
          clientOptions: {
            documentSelector: [language],
          },
          connection: {
            options: connectionOptions,
          },
        },
      },
    },
  };
}

import { MonacoEditorReactComp } from '@typefox/monaco-editor-react';
import type { TextContents } from 'monaco-languageclient/editorApp';
import { configureDefaultWorkerFactory } from 'monaco-languageclient/workerFactory';
import type { ReactElement } from 'react';
import { memo, useCallback, useEffect, useState } from 'react';

import type { MonacoEditorReactConfig } from '../dsl-editor/config';

export interface DslGrammarExtensionEditorProps {
  className?: string;
  uri: string;
  value?: string;
  onChange?: (value: string) => void;
}

const MemoizedMonacoEditorReactComp = memo(MonacoEditorReactComp);

export function DslGrammarExtensionEditor(props: DslGrammarExtensionEditorProps): ReactElement {
  const [config, setConfig] = useState<MonacoEditorReactConfig>();

  useEffect(() => {
    setConfig(createConfig(props.uri, props.value ?? ''));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.uri]);

  const onTextChanged = useCallback(
    (textContents: TextContents) => {
      const onChange = props.onChange;
      if (onChange && textContents.modified) {
        onChange(textContents.modified);
      }
    },
    [props.onChange],
  );

  if (!config) {
    return <div />;
  }

  return (
    <MemoizedMonacoEditorReactComp
      className={props.className}
      vscodeApiConfig={config.vscodeApiConfig}
      languageClientConfig={config.languageClientConfig}
      editorAppConfig={config.editorAppConfig}
      onTextChanged={onTextChanged}
    />
  );
}

function createConfig(uri: string, content: string): MonacoEditorReactConfig {
  const language = 'json';
  const languageGrammarUrl = language + '-grammar.json';
  const textmateGrammar = '';
  return {
    vscodeApiConfig: {
      $type: 'extended',
      viewsConfig: {
        $type: 'EditorService',
      },
      userConfiguration: {
        json: JSON.stringify({
          'editor.experimental.asyncTokenization': false,
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
    editorAppConfig: {
      codeResources: {
        modified: {
          text: content,
          enforceLanguageId: language,
          uri,
        },
      },
    },
  };
}

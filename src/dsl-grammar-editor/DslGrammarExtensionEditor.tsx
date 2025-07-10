import { LogLevel } from '@codingame/monaco-vscode-api';
import { MonacoEditorReactComp } from '@typefox/monaco-editor-react';
import type { TextContents, WrapperConfig } from 'monaco-editor-wrapper';
import { configureDefaultWorkerFactory } from 'monaco-editor-wrapper/workers/workerLoaders';
import type { ReactElement } from 'react';
import { memo, useCallback, useEffect, useState } from 'react';

export interface DslGrammarExtensionEditorProps {
  className?: string;
  uri: string;
  value?: string;
  onChange?: (value: string) => void;
}

const MemoizedMonacoEditorReactComp = memo(MonacoEditorReactComp);

export function DslGrammarExtensionEditor(props: DslGrammarExtensionEditorProps): ReactElement {
  const [config, setConfig] = useState<WrapperConfig>();

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
    <MemoizedMonacoEditorReactComp className={props.className} wrapperConfig={config} onTextChanged={onTextChanged} />
  );
}

function createConfig(uri: string, content: string): WrapperConfig {
  const language = 'json';
  const languageGrammarUrl = language + '-grammar.json';
  const textmateGrammar = '';
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
          'editor.wordBasedSuggestions': 'off',
          'editor.experimental.asyncTokenization': false,
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
      monacoWorkerFactory: configureDefaultWorkerFactory,
    },
  };
}

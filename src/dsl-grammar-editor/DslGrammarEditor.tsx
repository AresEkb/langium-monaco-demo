import { MonacoEditorReactComp } from '@typefox/monaco-editor-react';
import type { TextContents } from 'monaco-languageclient/editorApp';
import type { ReactElement } from 'react';
import { memo, useCallback, useEffect, useState } from 'react';

import type { MonacoEditorReactConfig } from '../dsl-editor/config';
import { createConfig } from '../dsl-editor/config';

import { dslGrammarTextmate } from './dslGrammarTextmate';

export interface DslGrammarEditorProps {
  className?: string;
  uri: string;
  value?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}

const MemoizedMonacoEditorReactComp = memo(MonacoEditorReactComp);

export function DslGrammarEditor(props: DslGrammarEditorProps): ReactElement {
  const [config, setConfig] = useState<MonacoEditorReactConfig>();

  useEffect(() => {
    let worker: Worker | undefined = new Worker(new URL('./DslGrammarEditorWorker.js', import.meta.url), {
      type: 'module',
    });
    setConfig(
      createConfig(props.uri, props.value ?? '', 'langium', dslGrammarTextmate, props.readOnly ?? false, {
        $type: 'WorkerDirect',
        worker,
      }),
    );
    return () => {
      setTimeout(() => {
        worker?.terminate();
        worker = undefined;
      }, 5000);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.readOnly, props.uri]);

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

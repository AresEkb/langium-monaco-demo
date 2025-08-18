import { Range } from '@codingame/monaco-vscode-editor-api';
import { MonacoEditorReactComp } from '@typefox/monaco-editor-react';
import type { AstNode } from 'langium';
import type { MonacoEditorLanguageClientWrapper, WrapperConfig } from 'monaco-editor-wrapper';
import type { MonacoLanguageClient } from 'monaco-languageclient';
import { enqueueSnackbar } from 'notistack';
import type { ReactElement } from 'react';
import { memo, useCallback, useEffect, useState } from 'react';
import { LogMessageNotification } from 'vscode-languageserver-protocol';

import { dslSetValueNotification } from './AbstractDslServer';
import type { DslDocumentChange } from './DslServer';
import { dslDocumentChangeNotification } from './DslServer';
import { createConfig } from './config';
import type { DslWorker } from './utils';
import { toVariantType } from './utils';

export interface DslEditorProps {
  className?: string;
  uri: string;
  language: string;
  grammar: string;
  grammarExtension?: string;
  value?: string;
  onChange?: (value: DslEditorValue) => void;
  excludeText?: boolean;
  includeAst?: boolean;
  readOnly?: boolean;
}

export interface DslEditorValue {
  text?: string;
  ast?: AstNode;
}

const MemoizedMonacoEditorReactComp = memo(MonacoEditorReactComp);

export function DslEditor(props: DslEditorProps): ReactElement {
  const [config, setConfig] = useState<WrapperConfig>();
  const [client, setClient] = useState<MonacoLanguageClient>();

  useEffect(() => {
    let mounted = true;
    let worker: Worker;
    async function init() {
      const dslWorker = await createWorker(
        props.language,
        props.grammar,
        props.grammarExtension,
        props.excludeText,
        props.includeAst,
      );
      worker = dslWorker.worker;
      if (mounted) {
        setConfig(
          createConfig(props.uri, '', props.language, dslWorker.textmateGrammar, props.readOnly ?? false, {
            $type: 'WorkerDirect',
            worker,
          }),
        );
      }
    }
    void init();
    return () => {
      mounted = false;
      setTimeout(() => {
        worker.terminate();
      }, 5000);
    };
  }, [
    props.excludeText,
    props.grammar,
    props.grammarExtension,
    props.includeAst,
    props.language,
    props.readOnly,
    props.uri,
  ]);

  useEffect(() => {
    void client?.sendNotification(dslSetValueNotification, props.value ?? '');
  }, [client, props.uri, props.value]);

  const onLoad = useCallback(
    (wrapper: MonacoEditorLanguageClientWrapper) => {
      const newClient = wrapper.getLanguageClient(props.language);
      if (!newClient) {
        throw new Error();
      }
      setClient(newClient);
      newClient.onNotification(LogMessageNotification.type, (params) => {
        enqueueSnackbar(params.message, { variant: toVariantType(params.type) });
      });

      const editor = wrapper.getEditor();
      if (!editor) {
        throw new Error();
      }
      newClient.onNotification(dslSetValueNotification, (value) => {
        const selections = editor.getSelections();
        editor
          .getModel()
          ?.pushEditOperations(
            selections,
            [{ range: new Range(0, 0, Number.MAX_SAFE_INTEGER, 0), text: value }],
            () => selections,
          );
        if (selections) {
          editor.setSelections(selections);
        }
      });

      const onChange = props.onChange;
      if (onChange) {
        newClient.onNotification(dslDocumentChangeNotification, (response: DslDocumentChange) => {
          if (response.uri === props.uri) {
            onChange({ text: response.text, ast: response.ast });
          }
        });
      }
    },
    [props.language, props.onChange, props.uri],
  );

  if (!config) {
    return <div />;
  }

  return <MemoizedMonacoEditorReactComp className={props.className} wrapperConfig={config} onLoad={onLoad} />;
}

function createWorker(
  language: string,
  grammar: string,
  grammarExtension?: string,
  excludeText?: boolean,
  includeAst?: boolean,
): Promise<DslWorker> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./DslEditorWorker.js', import.meta.url), { type: 'module' });
    worker.onmessage = (event) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (event.data.type === 'started') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        resolve({ worker, textmateGrammar: event.data.textmateGrammar });
      }
    };
    worker.onerror = reject;
    worker.postMessage({ type: 'start', language, grammar, grammarExtension, excludeText, includeAst });
  });
}

import { MonacoEditorReactComp } from '@typefox/monaco-editor-react';
import { AstNode } from 'langium';
import { MonacoEditorLanguageClientWrapper, WrapperConfig } from 'monaco-editor-wrapper';
import { MonacoLanguageClient } from 'monaco-languageclient';
import { memo, useCallback, useEffect, useState } from 'react';
import { dslSetValueNotification } from './AbstractDslServer';
import { createConfig } from './config';
import { DslDocumentChange, dslDocumentChangeNotification } from './DslServer';

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
}

export interface DslEditorValue {
  text?: string;
  ast?: AstNode;
}

const MemoizedMonacoEditorReactComp = memo(MonacoEditorReactComp);

export function DslEditor(props: DslEditorProps) {
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
          createConfig(props.uri, '', props.language, dslWorker.textmateGrammar, {
            $type: 'WorkerDirect',
            worker,
          }),
        );
      }
    }
    init();
    return () => {
      mounted = false;
      setTimeout(() => {
        worker.terminate();
      }, 5000);
    };
  }, [props.excludeText, props.grammar, props.grammarExtension, props.includeAst, props.language, props.uri]);

  useEffect(() => {
    client?.sendNotification(dslSetValueNotification, { uri: props.uri, value: props.value ?? '' });
  }, [client, props.uri, props.value]);

  const onLoad = useCallback(
    (wrapper: MonacoEditorLanguageClientWrapper) => {
      const client = wrapper.getLanguageClient(props.language);
      if (!client) {
        throw new Error();
      }
      setClient(client);
      const onChange = props.onChange;
      if (onChange) {
        client.onNotification(dslDocumentChangeNotification, (response: DslDocumentChange) => {
          if (response.uri === props.uri) {
            onChange({ text: response.text, ast: response.ast });
          }
        });
      }
    },
    [props.language, props.onChange, props.uri],
  );

  if (!config) {
    return <div></div>;
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
    const worker = new Worker(new URL('./DslEditorWorker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = (event) => {
      if (event.data.type === 'started') {
        resolve({ worker, textmateGrammar: event.data.textmateGrammar });
      }
    };
    worker.onerror = reject;
    worker.postMessage({ type: 'start', language, grammar, grammarExtension, excludeText, includeAst });
  });
}

interface DslWorker {
  worker: Worker;
  textmateGrammar: string;
}

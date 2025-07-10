import { MonacoEditorReactComp } from '@typefox/monaco-editor-react';
import type { MonacoEditorLanguageClientWrapper, WrapperConfig } from 'monaco-editor-wrapper';
import type { MonacoLanguageClient } from 'monaco-languageclient';
import type { ReactElement } from 'react';
import { memo, useCallback, useEffect, useState } from 'react';

import { createConfig } from '../dsl-editor/config';

import type { DslModelChange } from './DslModelServer';
import { dslModelChangeNotification, dslSetModelNotification } from './DslModelServer';
import type { EModel } from './Model';

export interface DslModelEditorProps {
  className?: string;
  uri: string;
  language: string;
  grammar: string;
  grammarExtension?: string;
  value: EModel;
  onChange?: (value: EModel) => void;
}

const MemoizedMonacoEditorReactComp = memo(MonacoEditorReactComp);

export function DslModelEditor(props: DslModelEditorProps): ReactElement {
  const [config, setConfig] = useState<WrapperConfig>();
  const [client, setClient] = useState<MonacoLanguageClient>();

  useEffect(() => {
    let mounted = true;
    let worker: Worker;
    async function init() {
      const dslWorker = await createWorker(props.language, props.grammar, props.grammarExtension, props.value.ns);
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
    void init();
    return () => {
      mounted = false;
      setTimeout(() => {
        worker.terminate();
      }, 5000);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.grammar, props.grammarExtension, props.language, props.uri]);

  useEffect(() => {
    void client?.sendNotification(dslSetModelNotification, { uri: props.uri, value: props.value });
  }, [client, props.uri, props.value]);

  const onLoad = useCallback(
    (wrapper: MonacoEditorLanguageClientWrapper) => {
      const newClient = wrapper.getLanguageClient(props.language);
      if (!newClient) {
        throw new Error();
      }
      setClient(newClient);
      const onChange = props.onChange;
      if (onChange) {
        newClient.onNotification(dslModelChangeNotification, (response: DslModelChange) => {
          if (response.uri === props.uri) {
            onChange(response.model);
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
  grammarExtension: string | undefined,
  namespaces: Record<string, string>,
): Promise<DslWorker> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./DslModelEditorWorker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = (event) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (event.data.type === 'started') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        resolve({ worker, textmateGrammar: event.data.textmateGrammar });
      }
    };
    worker.onerror = reject;
    worker.postMessage({ type: 'start', language, grammar, grammarExtension, namespaces });
  });
}

interface DslWorker {
  worker: Worker;
  textmateGrammar: string;
}

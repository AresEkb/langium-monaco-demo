import { MonacoEditorReactComp } from '@typefox/monaco-editor-react';
import { AstNode } from 'langium';
import { generateTextMate } from 'langium-cli/textmate';
import { createServicesForGrammar } from 'langium/grammar';
import { MonacoEditorLanguageClientWrapper, WrapperConfig } from 'monaco-editor-wrapper';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { createConfig } from './config';
import { DocumentChange, documentChange } from './workerUtils';

export interface LangiumEditorProps {
  className?: string;
  uri: string;
  language: string;
  grammar: string;
  grammarExtension?: string;
  value?: string;
  onChange?: (value: LangiumEditorValue) => void;
  excludeText?: boolean;
  includeAst?: boolean;
}

export interface LangiumEditorValue {
  text?: string;
  ast?: AstNode;
}

const MemoizedMonacoEditorReactComp = memo(MonacoEditorReactComp);

export function LangiumEditor(props: LangiumEditorProps) {
  const worker = useRef<Worker>(undefined);
  const [config, setConfig] = useState<WrapperConfig>();

  useEffect(() => {
    let mounted = true;
    async function init() {
      worker.current = await createWorker(props.grammar, props.grammarExtension, props.excludeText, props.includeAst);
      const { Grammar } = await createServicesForGrammar({ grammar: props.grammar });
      const textmateGrammar = generateTextMate(Grammar, { id: props.language, grammar: '' });
      if (mounted) {
        setConfig(
          createConfig(props.uri, props.value ?? '', props.language, textmateGrammar, {
            $type: 'WorkerDirect',
            worker: worker.current,
          }),
        );
      }
    }
    init();
    return () => {
      mounted = false;
      setTimeout(() => {
        worker.current?.terminate();
        worker.current = undefined;
      }, 5000);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.grammar, props.uri]);

  useEffect(() => {
    worker.current?.postMessage({ type: 'setValue', uri: props.uri, value: props.value ?? '' });
  }, [props.uri, props.value]);

  const onLoad = useCallback(
    (wrapper: MonacoEditorLanguageClientWrapper) => {
      const onChange = props.onChange;
      if (onChange) {
        const client = wrapper.getLanguageClient(props.language);
        if (!client) {
          throw new Error();
        }
        client.onNotification(documentChange, (response: DocumentChange) => {
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
  grammar: string,
  grammarExtension?: string,
  excludeText?: boolean,
  includeAst?: boolean,
): Promise<Worker> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./LangiumEditorWorker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = (event) => {
      if (event.data.type === 'started') {
        resolve(worker);
      }
    };
    worker.onerror = reject;
    worker.postMessage({ type: 'start', grammar, grammarExtension, excludeText, includeAst });
  });
}

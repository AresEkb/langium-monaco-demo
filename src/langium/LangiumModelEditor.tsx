import { MonacoEditorReactComp } from '@typefox/monaco-editor-react';
import { generateTextMate } from 'langium-cli/textmate';
import { createServicesForGrammar } from 'langium/grammar';
import { MonacoEditorLanguageClientWrapper, WrapperConfig } from 'monaco-editor-wrapper';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { dslGrammarExtension } from '../dsl/grammarExtension';
import { createConfig } from './config';
import { parseGrammarExtension } from './GrammarExtension';
import { EModel } from './Model';
import { transformNode } from './ModelDslServer';
import { ModelSerializer } from './ModelSerializer';
import { printAst } from './print';
import { modelDocumentChange, ModelDocumentChange } from './workerUtils';

export interface LangiumModelEditorProps {
  className?: string;
  uri: string;
  language: string;
  grammar: string;
  grammarExtension?: string;
  value: EModel;
  onChange?: (value: EModel) => void;
}

const MemoizedMonacoEditorReactComp = memo(MonacoEditorReactComp);

export function LangiumModelEditor(props: LangiumModelEditorProps) {
  const worker = useRef<Worker>(undefined);
  const [config, setConfig] = useState<WrapperConfig>();

  useEffect(() => {
    let mounted = true;
    async function init() {
      worker.current = await createWorker(props.grammar, props.grammarExtension, props.value.ns);

      const { Grammar } = await createServicesForGrammar({ grammar: props.grammar });
      const textmateGrammar = generateTextMate(Grammar, { id: props.language, grammar: '' });
      if (mounted) {
        const grammarExtension = parseGrammarExtension(dslGrammarExtension);
        const ast = new ModelSerializer().deserialize(props.value, {
          grammar: Grammar,
          grammarExtension,
        });
        const denormalizedAst = transformNode(ast, grammarExtension, 'denormalize');
        const text = printAst(denormalizedAst, Grammar, grammarExtension);
        setConfig(
          createConfig(props.uri, text, props.language, textmateGrammar, {
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
        client.onNotification(modelDocumentChange, (response: ModelDocumentChange) => {
          if (response.uri === props.uri) {
            onChange(response.model);
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
  grammarExtension: string | undefined,
  namespaces: Record<string, string>,
): Promise<Worker> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./LangiumModelEditorWorker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = (event) => {
      if (event.data.type === 'started') {
        resolve(worker);
      }
    };
    worker.onerror = reject;
    worker.postMessage({ type: 'start', grammar, grammarExtension, namespaces });
  });
}

import { MonacoEditorReactComp } from '@typefox/monaco-editor-react';
import { TextContents, WrapperConfig } from 'monaco-editor-wrapper';
import { memo, useCallback, useEffect, useState } from 'react';
import { createConfig } from './config';
import { langiumGrammarTextmate } from './langiumGrammarTextmate';

export interface LangiumGrammarEditorProps {
  className?: string;
  uri: string;
  value?: string;
  onChange?: (value: string) => void;
}

const MemoizedMonacoEditorReactComp = memo(MonacoEditorReactComp);

export function LangiumGrammarEditor(props: LangiumGrammarEditorProps) {
  const [config, setConfig] = useState<WrapperConfig>();

  useEffect(() => {
    let mounted = true;
    let worker: Worker | undefined = new Worker(new URL('./LangiumGrammarEditorWorker.ts', import.meta.url), {
      type: 'module',
    });
    const textmateGrammar = JSON.stringify(langiumGrammarTextmate);
    if (mounted) {
      setConfig(
        createConfig(props.uri, props.value ?? '', 'langium', textmateGrammar, {
          $type: 'WorkerDirect',
          worker,
        }),
      );
    }
    return () => {
      mounted = false;
      setTimeout(() => {
        worker?.terminate();
        worker = undefined;
      }, 5000);
    };
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
    return <div></div>;
  }

  return (
    <MemoizedMonacoEditorReactComp className={props.className} wrapperConfig={config} onTextChanged={onTextChanged} />
  );
}

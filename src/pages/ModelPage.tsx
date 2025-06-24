import { create as createJsonDiffPatch } from 'jsondiffpatch';
import { format as formatJsonDiff } from 'jsondiffpatch/formatters/html';
import { useState } from 'react';
import { extendedDslGrammar } from '../dsl/extendedGrammar';
import { dslGrammarExtension } from '../dsl/grammarExtension';
import { dslModel } from '../dsl/model';
import { useDebounced } from '../hooks/useDebounced';
import { LangiumModelEditor } from '../langium/LangiumModelEditor';
import { EModel } from '../langium/Model';

const jsonDiffPatch = createJsonDiffPatch({});

export function ModelPage() {
  const [model, setModel] = useState<EModel>();
  const [modelDiff, setModelDiff] = useState<string>();

  const onChange = useDebounced(async (value: EModel) => {
    setModel((model) => {
      setModelDiff(formatJsonDiff(jsonDiffPatch.diff(model, value) ?? {}, model));
      return value;
    });
  }, 500);

  return (
    <main>
      <LangiumModelEditor
        uri="file:///code"
        language="dsl"
        grammar={extendedDslGrammar}
        grammarExtension={dslGrammarExtension}
        value={dslModel}
        onChange={onChange}
      />
      <div className="json-diff" dangerouslySetInnerHTML={{ __html: modelDiff ?? '' }} />
      {model ? (
        <LangiumModelEditor uri="file:///code2" language="dsl2" grammar={extendedDslGrammar} value={model} />
      ) : (
        <div></div>
      )}
    </main>
  );
}

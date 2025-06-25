import { create as createJsonDiffPatch } from 'jsondiffpatch';
import { format as formatJsonDiff } from 'jsondiffpatch/formatters/html';
import { useState } from 'react';
import { extendedClassModelGrammar } from '../classmodel/extendedGrammar';
import { classModelGrammarExtension } from '../classmodel/grammarExtension';
import { classModel } from '../classmodel/model';
import { DslModelEditor } from '../dsl-model-editor/DslModelEditor';
import { EModel } from '../dsl-model-editor/Model';
import { useDebounced } from '../hooks/useDebounced';

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
      <DslModelEditor
        uri="file:///code"
        language="dsl"
        grammar={extendedClassModelGrammar}
        grammarExtension={classModelGrammarExtension}
        value={classModel}
        onChange={onChange}
      />
      <div className="json-diff" dangerouslySetInnerHTML={{ __html: modelDiff ?? '' }} />
      {model ? (
        <DslModelEditor
          uri="file:///code2"
          language="dsl2"
          grammar={extendedClassModelGrammar}
          grammarExtension={classModelGrammarExtension}
          value={model}
        />
      ) : (
        <div></div>
      )}
    </main>
  );
}

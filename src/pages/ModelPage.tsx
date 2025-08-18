import { create as createJsonDiffPatch } from 'jsondiffpatch';
import { format as formatJsonDiff } from 'jsondiffpatch/formatters/html';
import type { ReactElement } from 'react';
import { useState } from 'react';

import { extendedClassModelGrammar } from '../classmodel/extendedGrammar';
import { classModelGrammarExtension } from '../classmodel/grammarExtension';
import { classModel } from '../classmodel/model';
import { DslModelEditor } from '../dsl-model-editor/DslModelEditor';
import type { EModel } from '../dsl-model-editor/Model';
import { useDebounced } from '../hooks/useDebounced';

const jsonDiffPatch = createJsonDiffPatch({});

export function ModelPage(): ReactElement {
  const [model, setModel] = useState<EModel>(classModel);
  const [modelDiff, setModelDiff] = useState<string | undefined>(
    formatJsonDiff(jsonDiffPatch.diff(undefined, classModel)),
  );

  const onChange = useDebounced((value: EModel) => {
    setModel((previousModel) => {
      setModelDiff(formatJsonDiff(jsonDiffPatch.diff(previousModel, value) ?? {}, previousModel));
      return value;
    });
  }, 500);

  // console.log(
  //   JSON.stringify({
  //     type: 'langium',
  //     namespaces: classModel.ns,
  //     grammar: extendedClassModelGrammar,
  //     extension: classModelGrammarExtension,
  //   }),
  // );

  return (
    <main>
      <DslModelEditor
        uri="file:///code"
        language="classmodel"
        namespaces={classModel.ns}
        grammar={extendedClassModelGrammar}
        grammarExtension={classModelGrammarExtension}
        value={classModel}
        onChange={onChange}
      />
      <div className="json-diff" dangerouslySetInnerHTML={{ __html: modelDiff ?? '' }} />
      {model ? (
        <DslModelEditor
          uri="file:///code2"
          language="classmodel2"
          namespaces={classModel.ns}
          grammar={extendedClassModelGrammar}
          grammarExtension={classModelGrammarExtension}
          value={model}
        />
      ) : (
        <div />
      )}
    </main>
  );
}

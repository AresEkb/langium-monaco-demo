import { create as createJsonDiffPatch } from 'jsondiffpatch';
import { format as formatJsonDiff } from 'jsondiffpatch/formatters/html';
import { AstNode } from 'langium';
import { useState } from 'react';
import { classModelGrammar } from '../classmodel/grammar';
import { classModelGrammarExtension } from '../classmodel/grammarExtension';
import { classModelText } from '../classmodel/text';
import { DslEditor, DslEditorValue } from '../dsl-editor/DslEditor';
import { useDebounced } from '../hooks/useDebounced';

const jsonDiffPatch = createJsonDiffPatch();

export function AstPage() {
  const [, setAst] = useState<AstNode>();
  const [astDiff, setAstDiff] = useState<string>();

  const onChange = useDebounced((value: DslEditorValue) => {
    setAst((ast) => {
      setAstDiff(formatJsonDiff(jsonDiffPatch.diff(ast, value.ast) ?? {}, ast));
      return value.ast;
    });
  }, 500);

  return (
    <main>
      <DslEditor
        uri="file:///code"
        language="dsl"
        grammar={classModelGrammar}
        grammarExtension={classModelGrammarExtension}
        value={classModelText}
        onChange={onChange}
        excludeText
        includeAst
      />
      <div className="json-diff" dangerouslySetInnerHTML={{ __html: astDiff ?? '' }} />
    </main>
  );
}

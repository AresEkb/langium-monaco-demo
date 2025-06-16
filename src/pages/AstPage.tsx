import { create as createJsonDiffPatch } from 'jsondiffpatch';
import { format as formatJsonDiff } from 'jsondiffpatch/formatters/html';
import { AstNode } from 'langium';
import { useState } from 'react';
import { dslGrammar } from '../dsl/grammar';
import { dslSample } from '../dsl/sample';
import { useDebounced } from '../hooks/useDebounced';
import { LangiumEditor, LangiumEditorValue } from '../langium/LangiumEditor';

const jsonDiffPatch = createJsonDiffPatch();

export function AstPage() {
  const [, setAst] = useState<AstNode>();
  const [astDiff, setAstDiff] = useState<string>();

  const onChange = useDebounced((value: LangiumEditorValue) => {
    setAst((ast) => {
      setAstDiff(formatJsonDiff(jsonDiffPatch.diff(ast, value.ast) ?? {}, ast));
      return value.ast;
    });
  }, 500);

  return (
    <main>
      <LangiumEditor
        uri="file:///code"
        language="dsl"
        grammar={dslGrammar}
        value={dslSample}
        onChange={onChange}
        excludeText
        includeAst
      />
      <div className="json-diff" dangerouslySetInnerHTML={{ __html: astDiff ?? '' }} />
    </main>
  );
}

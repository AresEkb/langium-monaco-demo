import { create as createJsonDiffPatch } from 'jsondiffpatch';
import { format as formatJsonDiff } from 'jsondiffpatch/formatters/html';
import { AstNode } from 'langium';
import { createServicesForGrammar } from 'langium/grammar';
import { useState } from 'react';

import { dslGrammar } from '../dsl/grammar';
import { dslSample } from '../dsl/sample';
import { useDebounced } from '../hooks/useDebounced';
import { LangiumEditor, LangiumEditorValue } from '../langium/LangiumEditor';
import { printAst } from '../langium/print';

const jsonDiffPatch = createJsonDiffPatch();

export function PrintPage() {
  const [, setAst] = useState<AstNode>();
  const [astDiff, setAstDiff] = useState<string>();
  const [generatedContent, setGeneratedContent] = useState<string>();

  const onChange = useDebounced(async (value: LangiumEditorValue) => {
    setAst((ast) => {
      setAstDiff(formatJsonDiff(jsonDiffPatch.diff(ast, value.ast) ?? {}, ast));
      return value.ast;
    });
    if (value.ast) {
      const { Grammar } = await createServicesForGrammar({ grammar: dslGrammar });
      setGeneratedContent(printAst(value.ast, Grammar));
    }
  }, 500);

  return (
    <main>
      <LangiumEditor
        uri="file:///code"
        value={dslSample}
        language="dsl"
        grammar={dslGrammar}
        onChange={onChange}
        excludeText
        includeAst
      />
      <div className="json-diff" dangerouslySetInnerHTML={{ __html: astDiff ?? '' }} />
      <LangiumEditor uri="file:///code2" value={generatedContent} language="dsl2" grammar={dslGrammar} />
    </main>
  );
}

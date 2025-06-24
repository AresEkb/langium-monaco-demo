import { create as createJsonDiffPatch } from 'jsondiffpatch';
import { format as formatJsonDiff } from 'jsondiffpatch/formatters/html';
import { AstNode } from 'langium';
import { createServicesForGrammar } from 'langium/grammar';
import { useState } from 'react';
import { extendedDslGrammar } from '../dsl/extendedGrammar';
import { dslGrammarExtension } from '../dsl/grammarExtension';
import { dslSample } from '../dsl/sample';
import { useDebounced } from '../hooks/useDebounced';
import { parseGrammarExtension } from '../langium/GrammarExtension';
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
      const { Grammar } = await createServicesForGrammar({ grammar: extendedDslGrammar });
      setGeneratedContent(printAst(value.ast, Grammar, parseGrammarExtension(dslGrammarExtension)));
    }
  }, 500);

  return (
    <main>
      <LangiumEditor
        uri="file:///code"
        value={dslSample}
        language="dsl"
        grammar={extendedDslGrammar}
        grammarExtension={dslGrammarExtension}
        onChange={onChange}
        excludeText
        includeAst
      />
      <div className="json-diff" dangerouslySetInnerHTML={{ __html: astDiff ?? '' }} />
      <LangiumEditor
        uri="file:///code2"
        value={generatedContent}
        language="dsl2"
        grammar={extendedDslGrammar}
        grammarExtension={dslGrammarExtension}
      />
    </main>
  );
}

import { create as createJsonDiffPatch } from 'jsondiffpatch';
import { format as formatJsonDiff } from 'jsondiffpatch/formatters/html';
import type { AstNode } from 'langium';
import { createServicesForGrammar } from 'langium/grammar';
import type { ReactElement} from 'react';
import { useState } from 'react';

import { extendedClassModelGrammar } from '../classmodel/extendedGrammar';
import { classModelGrammarExtension } from '../classmodel/grammarExtension';
import { classModelText } from '../classmodel/text';
import type { DslEditorValue } from '../dsl-editor/DslEditor';
import { DslEditor } from '../dsl-editor/DslEditor';
import { parseGrammarExtension } from '../dsl-editor/GrammarExtension';
import { printAst } from '../dsl-editor/print';
import { useDebounced } from '../hooks/useDebounced';

const jsonDiffPatch = createJsonDiffPatch();

export function PrintPage(): ReactElement {
  // eslint-disable-next-line react/hook-use-state
  const [, setAst] = useState<AstNode>();
  const [astDiff, setAstDiff] = useState<string>();
  const [generatedContent, setGeneratedContent] = useState<string>();

  const onChange = useDebounced(async (value: DslEditorValue) => {
    setAst((ast) => {
      setAstDiff(formatJsonDiff(jsonDiffPatch.diff(ast, value.ast) ?? {}, ast));
      return value.ast;
    });
    if (value.ast) {
      const { Grammar } = await createServicesForGrammar({ grammar: extendedClassModelGrammar });
      setGeneratedContent(printAst(value.ast, Grammar, parseGrammarExtension(classModelGrammarExtension)));
    }
  }, 500);

  return (
    <main>
      <DslEditor
        uri="file:///code"
        language="dsl"
        grammar={extendedClassModelGrammar}
        grammarExtension={classModelGrammarExtension}
        value={classModelText}
        onChange={onChange}
        excludeText
        includeAst
      />
      <div className="json-diff" dangerouslySetInnerHTML={{ __html: astDiff ?? '' }} />
      <DslEditor
        uri="file:///code2"
        language="dsl2"
        grammar={extendedClassModelGrammar}
        grammarExtension={classModelGrammarExtension}
        value={generatedContent}
      />
    </main>
  );
}

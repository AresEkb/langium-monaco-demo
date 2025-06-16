import { useState } from 'react';
import { dslGrammar } from '../dsl/grammar';
import { dslSample } from '../dsl/sample';
import { useDebounced } from '../hooks/useDebounced';
import { LangiumEditor } from '../langium/LangiumEditor';
import { LangiumGrammarEditor } from '../langium/LangiumGrammarEditor';

export function GrammarPage() {
  const [grammar, setGrammar] = useState(dslGrammar);
  const onGrammarChanged = useDebounced(setGrammar, 500);
  return (
    <main>
      <LangiumGrammarEditor uri="file:///grammar" value={dslGrammar} onChange={onGrammarChanged} />
      <LangiumEditor uri="file:///code" value={dslSample} language="dsl" grammar={grammar} />
    </main>
  );
}

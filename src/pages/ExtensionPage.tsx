import { useState } from 'react';
import { simplifiedDslGrammar } from '../dsl/simplifiedGrammar';
import { simplifiedDslSample } from '../dsl/simplifiedSample';
import { useDebounced } from '../hooks/useDebounced';
import { LangiumEditor } from '../langium/LangiumEditor';
import { LangiumGrammarEditor } from '../langium/LangiumGrammarEditor';

export function ExtensionPage() {
  const [grammar, setGrammar] = useState(simplifiedDslGrammar);
  const onGrammarChanged = useDebounced(setGrammar, 500);
  return (
    <main>
      <div>
        <LangiumGrammarEditor uri="file:///grammar" value={grammar} onChange={onGrammarChanged} />
      </div>
      <LangiumEditor uri="file:///code" value={simplifiedDslSample} language="dsl" grammar={grammar} />
    </main>
  );
}

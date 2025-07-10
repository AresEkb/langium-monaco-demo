import type { ReactElement} from 'react';
import { useState } from 'react';

import { simplifiedClassModelGrammar } from '../classmodel/simplifiedGrammar';
import { simplifiedClassModelText } from '../classmodel/simplifiedText';
import { DslEditor } from '../dsl-editor/DslEditor';
import { DslGrammarEditor } from '../dsl-grammar-editor/DslGrammarEditor';
import { useDebounced } from '../hooks/useDebounced';

export function GrammarPage(): ReactElement {
  const [grammar, setGrammar] = useState(simplifiedClassModelGrammar);
  const onGrammarChanged = useDebounced(setGrammar, 500);
  return (
    <main>
      <DslGrammarEditor uri="file:///grammar" value={grammar} onChange={onGrammarChanged} />
      <DslEditor uri="file:///code" value={simplifiedClassModelText} language="dsl" grammar={grammar} />
    </main>
  );
}

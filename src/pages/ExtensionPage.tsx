import { useState } from 'react';
import { classModelGrammar } from '../classmodel/grammar';
import { classModelGrammarExtension } from '../classmodel/grammarExtension';
import { classModelText } from '../classmodel/text';
import { DslEditor } from '../dsl-editor/DslEditor';
import { DslGrammarEditor } from '../dsl-grammar-editor/DslGrammarEditor';
import { DslGrammarExtensionEditor } from '../dsl-grammar-editor/DslGrammarExtensionEditor';
import { useDebounced } from '../hooks/useDebounced';

export function ExtensionPage() {
  const [grammar, setGrammar] = useState(classModelGrammar);
  const [grammarExtension, setGrammarExtension] = useState(classModelGrammarExtension);
  const onGrammarChanged = useDebounced(setGrammar, 500);
  const onGrammarExtensionChanged = useDebounced(setGrammarExtension, 500);
  return (
    <main>
      <div className="column">
        <DslGrammarEditor uri="file:///grammar" value={grammar} onChange={onGrammarChanged} />
        <DslGrammarExtensionEditor
          uri="file:///grammar-extension"
          value={grammarExtension}
          onChange={onGrammarExtensionChanged}
        />
      </div>
      <DslEditor
        uri="file:///code"
        language="dsl"
        grammar={grammar}
        grammarExtension={grammarExtension}
        value={classModelText}
      />
    </main>
  );
}

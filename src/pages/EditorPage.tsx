import { classModelGrammar } from '../classmodel/grammar';
import { classModelGrammarExtension } from '../classmodel/grammarExtension';
import { classModelText } from '../classmodel/text';
import { DslEditor } from '../dsl-editor/DslEditor';

export function EditorPage() {
  return (
    <main>
      <DslEditor
        uri="file:///code"
        language="dsl"
        grammar={classModelGrammar}
        grammarExtension={classModelGrammarExtension}
        value={classModelText}
      />
    </main>
  );
}

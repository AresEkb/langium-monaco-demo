import { dslGrammar } from '../dsl/grammar';
import { dslSample } from '../dsl/sample';
import { LangiumEditor } from '../langium/LangiumEditor';

export function EditorPage() {
  return (
    <main>
      <LangiumEditor uri="file:///code" language="dsl" grammar={dslGrammar} value={dslSample} />
    </main>
  );
}

import type { ReactElement } from 'react';

import { classModelGrammar } from '../classmodel/grammar';
import { classModelGrammarExtension } from '../classmodel/grammarExtension';
import { classModelText } from '../classmodel/text';
import { DslEditor } from '../dsl-editor/DslEditor';

export function EditorPage(): ReactElement {
  return (
    <main>
      <DslEditor
        uri="file:///code"
        language="classmodel"
        grammar={classModelGrammar}
        grammarExtension={classModelGrammarExtension}
        value={classModelText}
      />
    </main>
  );
}

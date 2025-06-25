import { DslServer } from './DslServer.js';

self.onmessage = async (event) => {
  const data = event.data;
  if (data.type === 'start') {
    if (typeof data.language !== 'string') {
      throw new Error('Language should be a string');
    }
    if (typeof data.grammar !== 'string') {
      throw new Error('Grammar should be a string');
    }
    if (data.grammarExtension !== undefined && typeof data.grammarExtension !== 'string') {
      throw new Error('Grammar extension should be undefined or a string');
    }
    if (data.excludeText !== undefined && typeof data.excludeText !== 'boolean') {
      throw new Error('Exclude text should be undefined or a boolean');
    }
    if (data.includeAst !== undefined && typeof data.includeAst !== 'boolean') {
      throw new Error('Include AST should be undefined or a boolean');
    }
    const server = new DslServer(
      data.language,
      data.grammar,
      data.grammarExtension,
      data.excludeText ?? false,
      data.includeAst ?? false,
    );
    await server.start();
    postMessage({ type: 'started', textmateGrammar: server.textmateGrammar });
  }
};

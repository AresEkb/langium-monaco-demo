import { DslModelServer } from './DslModelServer.js';

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
    if (typeof data.namespaces !== 'object' || data.namespaces === null) {
      throw new Error('Namespaces should be a record');
    }
    const server = new DslModelServer(data.language, data.grammar, data.grammarExtension, data.namespaces);
    await server.start();
    postMessage({ type: 'started', textmateGrammar: server.textmateGrammar });
  }
};

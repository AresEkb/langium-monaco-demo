import { DslServer } from './DslServer.js';

let server: DslServer | undefined = undefined;

addEventListener('message', (event) => {
  switch (event.data.type) {
    case 'start':
      start(event.data);
      break;
    case 'setValue':
      setValue(event.data);
      break;
  }
});

async function start(data: Record<string, unknown>) {
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
  server = new DslServer(data.grammar, data.grammarExtension, data.excludeText ?? false, data.includeAst ?? false);
  await server.start();
  postMessage({ type: 'started' });
}

function setValue(data: Record<string, unknown>) {
  if (typeof data.uri !== 'string') {
    throw new Error('URI should be a string');
  }
  if (typeof data.value !== 'string') {
    throw new Error('Value should be a string');
  }
  if (!server) {
    throw new Error('Server should be started');
  }
  server.setValue(data.uri, data.value);
}

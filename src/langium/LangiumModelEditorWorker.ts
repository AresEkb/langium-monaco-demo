import { isEModel } from './Model.js';
import { ModelDslServer } from './ModelDslServer.js';

let server: ModelDslServer | undefined = undefined;

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
  if (typeof data.namespaces !== 'object' || data.namespaces === null) {
    throw new Error('Namespaces should be a record');
  }
  server = new ModelDslServer(data.grammar, data.grammarExtension, data.namespaces as Record<string, string>);
  await server.start();
  postMessage({ type: 'started' });
}

function setValue(data: Record<string, unknown>) {
  if (typeof data.uri !== 'string') {
    throw new Error('URI should be a string');
  }
  if (!isEModel(data.value)) {
    throw new Error('Value should be a model');
  }
  if (!server) {
    throw new Error('Server should be started');
  }
  server.setModel(data.uri, data.value);
}

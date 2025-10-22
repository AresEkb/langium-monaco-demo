import type { VariantType } from 'notistack';
import { MessageType } from 'vscode-languageserver-protocol';

export interface DslWorker {
  worker: Worker;
  textmateGrammar: string;
}

export interface DslWorkerStartedMessage {
  type: 'started';
  textmateGrammar: string;
}

export function isDslWorkerStartedMessage(data: unknown): data is DslWorkerStartedMessage {
  return (
    typeof data === 'object' &&
    data !== null &&
    'type' in data &&
    data.type === 'started' &&
    'textmateGrammar' in data &&
    typeof data.textmateGrammar === 'string'
  );
}

export function toVariantType(type: MessageType): VariantType {
  switch (type) {
    case MessageType.Error:
      return 'error';
    case MessageType.Warning:
      return 'warning';
    case MessageType.Info:
      return 'info';
    default:
      return 'default';
  }
}

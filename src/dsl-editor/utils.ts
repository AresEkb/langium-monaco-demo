import { VariantType } from 'notistack';
import { MessageType } from 'vscode-languageserver-protocol';

export interface DslWorker {
  worker: Worker;
  textmateGrammar: string;
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

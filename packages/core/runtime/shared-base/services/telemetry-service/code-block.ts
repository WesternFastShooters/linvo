import type { TelemetryEvent } from './types';

export type CodeBlockEventType =
  | 'codeBlockLanguageSelect'
  | 'htmlBlockTogglePreview'
  | 'htmlBlockPreviewFailed';

export type CodeBlockEvents = Record<CodeBlockEventType, TelemetryEvent>;

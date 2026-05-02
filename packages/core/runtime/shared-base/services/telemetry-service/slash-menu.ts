import type { TelemetryEvent } from './types';

export type SlashMenuEventType = 'OpenSlashMenu' | 'SelectSlashMenuItem';

export type SlashMenuEvents = Record<SlashMenuEventType, TelemetryEvent>;

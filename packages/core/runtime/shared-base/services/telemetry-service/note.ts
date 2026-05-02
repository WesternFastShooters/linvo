import type { TelemetryEvent } from './types';

export type NoteEventType = 'NoteDisplayModeChanged';

export type NoteEvents = {
  NoteDisplayModeChanged: TelemetryEvent & {
    control: 'display mode';
    type: 'note';
  };
  EdgelessNoteEditing: TelemetryEvent;
};

import { createIdentifier } from '@linvo-core/composition/di';
import type { ExtensionType } from '@linvo-core/store';

import type { CitationEvents } from './citation';
import type { CodeBlockEvents } from './code-block';
import type { OutDatabaseAllEvents } from './database';
import type { LinkToolbarEvents } from './link';
import type { NoteEvents } from './note';
import type { SlashMenuEvents } from './slash-menu';
import type {
  AttachmentReloadedEvent,
  AttachmentReloadedEventInToolbar,
  AttachmentUpgradedEvent,
  AttachmentUploadedEvent,
  BlockCreationEvent,
  DocCreatedEvent,
  EdgelessToolPickedEvent,
  ElementCreationEvent,
  ElementLockEvent,
  ElementUpdatedEvent,
  LatexEvent,
  LinkedDocCreatedEvent,
  LinkEvent,
  MindMapCollapseEvent,
  TelemetryEvent,
} from './types';

export type TelemetryEventMap = OutDatabaseAllEvents &
  LinkToolbarEvents &
  SlashMenuEvents &
  CodeBlockEvents &
  NoteEvents &
  CitationEvents & {
    DocCreated: DocCreatedEvent;
    Link: TelemetryEvent;
    LinkedDocCreated: LinkedDocCreatedEvent;
    SplitNote: TelemetryEvent;
    CanvasElementAdded: ElementCreationEvent;
    CanvasElementUpdated: ElementUpdatedEvent;
    EdgelessElementLocked: ElementLockEvent;
    ExpandedAndCollapsed: MindMapCollapseEvent;
    AttachmentReloadedEvent:
      | AttachmentReloadedEvent
      | AttachmentReloadedEventInToolbar;
    AttachmentUpgradedEvent: AttachmentUpgradedEvent;
    AttachmentUploadedEvent: AttachmentUploadedEvent;
    BlockCreated: BlockCreationEvent;
    EdgelessToolPicked: EdgelessToolPickedEvent;
    CreateEmbedBlock: LinkEvent;
    Latex: LatexEvent;
  };

export interface TelemetryService {
  track<T extends keyof TelemetryEventMap>(
    eventName: T,
    props: TelemetryEventMap[T]
  ): void;
}

export const TelemetryProvider = createIdentifier<TelemetryService>(
  'LinvoTelemetryService'
);

export const TelemetryExtension = (
  service: TelemetryService
): ExtensionType => {
  return {
    setup: di => {
      di.override(TelemetryProvider, () => service);
    },
  };
};

import { WidgetViewExtension } from '@linvo/std';
import { literal, unsafeStatic } from 'lit/static-html.js';

import { LINVO_DRAG_HANDLE_WIDGET } from './consts';

export * from './consts';
export * from './drag-handle';
export * from './utils';
export type { DragBlockPayload } from './watchers/drag-event-watcher';

export const dragHandleWidget = WidgetViewExtension(
  'linvo:page',
  LINVO_DRAG_HANDLE_WIDGET,
  literal`${unsafeStatic(LINVO_DRAG_HANDLE_WIDGET)}`
);

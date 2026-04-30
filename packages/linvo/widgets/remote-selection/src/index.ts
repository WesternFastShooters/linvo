import { WidgetViewExtension } from '@linvo/std';
import { literal, unsafeStatic } from 'lit/static-html.js';

import { LINVO_DOC_REMOTE_SELECTION_WIDGET } from './doc';
import { LINVO_EDGELESS_REMOTE_SELECTION_WIDGET } from './edgeless';

export * from './doc';
export * from './edgeless';

export const docRemoteSelectionWidget = WidgetViewExtension(
  'linvo:page',
  LINVO_DOC_REMOTE_SELECTION_WIDGET,
  literal`${unsafeStatic(LINVO_DOC_REMOTE_SELECTION_WIDGET)}`
);

export const edgelessRemoteSelectionWidget = WidgetViewExtension(
  'linvo:page',
  LINVO_EDGELESS_REMOTE_SELECTION_WIDGET,
  literal`${unsafeStatic(LINVO_EDGELESS_REMOTE_SELECTION_WIDGET)}`
);

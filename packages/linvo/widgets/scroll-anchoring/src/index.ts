import { WidgetViewExtension } from '@linvo/std';
import { literal, unsafeStatic } from 'lit/static-html.js';

import { LINVO_SCROLL_ANCHORING_WIDGET } from './scroll-anchoring.js';

export * from './scroll-anchoring.js';

export const scrollAnchoringWidget = WidgetViewExtension(
  'linvo:root',
  LINVO_SCROLL_ANCHORING_WIDGET,
  literal`${unsafeStatic(LINVO_SCROLL_ANCHORING_WIDGET)}`
);

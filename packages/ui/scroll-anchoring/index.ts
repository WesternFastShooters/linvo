import { WidgetViewExtension } from '@linvo-core/std';
import { literal, unsafeStatic } from 'lit/static-html.js';

import { LINVO_SCROLL_ANCHORING_WIDGET } from './scroll-anchoring';

export * from './scroll-anchoring';

export const scrollAnchoringWidget = WidgetViewExtension(
  'linvo:root',
  LINVO_SCROLL_ANCHORING_WIDGET,
  literal`${unsafeStatic(LINVO_SCROLL_ANCHORING_WIDGET)}`
);

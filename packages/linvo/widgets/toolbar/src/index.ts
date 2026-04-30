import { WidgetViewExtension } from '@linvo/std';
import { literal, unsafeStatic } from 'lit/static-html.js';

import { LINVO_TOOLBAR_WIDGET } from './toolbar';

export * from './toolbar';

export const toolbarWidget = WidgetViewExtension(
  'linvo:page',
  LINVO_TOOLBAR_WIDGET,
  literal`${unsafeStatic(LINVO_TOOLBAR_WIDGET)}`
);

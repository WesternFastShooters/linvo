import './test-block.js';

import type { ExtensionType } from '@linvo-core/store';
import { literal } from 'lit/static-html.js';

import { BlockViewExtension } from '@linvo-core/std';
import type { TitleBlockModel } from './test-schema';

export const testSpecs: ExtensionType[] = [
  BlockViewExtension('test:root', literal`test-root-block`),

  BlockViewExtension('test:note', literal`test-note-block`),

  BlockViewExtension('test:title', model => {
    const h = (model as TitleBlockModel).props.type$.value;

    if (h === 'h1') {
      return literal`test-title-h1-block`;
    }

    return literal`test-title-h2-block`;
  }),

  BlockViewExtension('test:surface', literal`test-surface-block`),

  BlockViewExtension('test:gfx-block', literal`test-gfx-block`),
];

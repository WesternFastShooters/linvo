import {
  type ViewExtensionContext,
  ViewExtensionProvider,
} from '@linvo/linvo-ext-loader';
import { SlashMenuConfigExtension } from '@linvo/linvo-widget-slash-menu';
import { BlockViewExtension, FlavourExtension } from '@linvo/std';
import { literal } from 'lit/static-html.js';

import { CalloutKeymapExtension } from './callout-keymap';
import { calloutSlashMenuConfig } from './configs/slash-menu';
import { effects } from './effects';

export class CalloutViewExtension extends ViewExtensionProvider {
  override name = 'linvo-callout-block';

  override effect() {
    super.effect();
    effects();
  }

  override setup(context: ViewExtensionContext) {
    super.setup(context);
    context.register([
      FlavourExtension('linvo:callout'),
      BlockViewExtension('linvo:callout', literal`linvo-callout`),
      CalloutKeymapExtension,
      SlashMenuConfigExtension('linvo:callout', calloutSlashMenuConfig),
    ]);
  }
}

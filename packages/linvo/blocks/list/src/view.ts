import {
  type ViewExtensionContext,
  ViewExtensionProvider,
} from '@linvo/linvo-ext-loader';
import { BlockViewExtension, FlavourExtension } from '@linvo/std';
import { literal } from 'lit/static-html.js';

import { effects } from './effects.js';
import { ListKeymapExtension, ListTextKeymapExtension } from './list-keymap.js';
import { ListMarkdownExtension } from './markdown.js';

export class ListViewExtension extends ViewExtensionProvider {
  override name = 'linvo-list-block';

  override effect(): void {
    super.effect();
    effects();
  }

  override setup(context: ViewExtensionContext) {
    super.setup(context);
    context.register([
      FlavourExtension('linvo:list'),
      BlockViewExtension('linvo:list', literal`linvo-list`),
      ListKeymapExtension,
      ListTextKeymapExtension,
      ListMarkdownExtension,
    ]);
  }
}

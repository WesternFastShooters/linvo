import {
  type ViewExtensionContext,
  ViewExtensionProvider,
} from '@linvo/linvo-ext-loader';
import { SlashMenuConfigExtension } from '@linvo/linvo-widget-slash-menu';
import { BlockViewExtension } from '@linvo/std';
import { literal } from 'lit/static-html.js';

import { latexSlashMenuConfig } from './configs/slash-menu';
import { effects } from './effects';

export class LatexViewExtension extends ViewExtensionProvider {
  override name = 'linvo-latex-block';

  override effect() {
    super.effect();
    effects();
  }

  override setup(context: ViewExtensionContext) {
    super.setup(context);
    context.register([
      BlockViewExtension('linvo:latex', literal`linvo-latex`),
      SlashMenuConfigExtension('linvo:latex', latexSlashMenuConfig),
    ]);
  }
}

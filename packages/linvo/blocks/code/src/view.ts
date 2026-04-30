import {
  type ViewExtensionContext,
  ViewExtensionProvider,
} from '@linvo/linvo-ext-loader';
import { SlashMenuConfigExtension } from '@linvo/linvo-widget-slash-menu';
import {
  BlockViewExtension,
  FlavourExtension,
  WidgetViewExtension,
} from '@linvo/std';
import { literal, unsafeStatic } from 'lit/static-html.js';

import { getCodeClipboardExtensions } from './clipboard/index.js';
import { CodeBlockConfigExtension } from './code-block-config';
import {
  CodeBlockInlineManagerExtension,
  CodeBlockUnitSpecExtension,
} from './code-block-inline.js';
import { CodeBlockHighlighter } from './code-block-service.js';
import { CodeKeymapExtension } from './code-keymap.js';
import { LINVO_CODE_TOOLBAR_WIDGET } from './code-toolbar/index.js';
import { codeSlashMenuConfig } from './configs/slash-menu.js';
import { effects } from './effects.js';
import { CodeBlockMarkdownExtension } from './markdown.js';

const codeToolbarWidget = WidgetViewExtension(
  'linvo:code',
  LINVO_CODE_TOOLBAR_WIDGET,
  literal`${unsafeStatic(LINVO_CODE_TOOLBAR_WIDGET)}`
);

export class CodeBlockViewExtension extends ViewExtensionProvider {
  override name = 'linvo-code-block';

  override effect() {
    super.effect();
    effects();
  }

  override setup(context: ViewExtensionContext) {
    super.setup(context);
    context.register([
      FlavourExtension('linvo:code'),
      CodeBlockHighlighter,
      BlockViewExtension('linvo:code', literal`linvo-code`),
      SlashMenuConfigExtension('linvo:code', codeSlashMenuConfig),
      CodeKeymapExtension,
      CodeBlockMarkdownExtension,
      ...getCodeClipboardExtensions(),
    ]);
    context.register([
      CodeBlockInlineManagerExtension,
      CodeBlockUnitSpecExtension,
    ]);
    if (!this.isMobile(context.scope)) {
      context.register(codeToolbarWidget);
    } else {
      context.register(
        CodeBlockConfigExtension({
          showLineNumbers: false,
        })
      );
    }
  }
}

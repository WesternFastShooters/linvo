import type { MenuOptions } from '@linvo/linvo-components/context-menu';
import {
  type ViewExtensionContext,
  ViewExtensionProvider,
} from '@linvo/linvo-ext-loader';
import { DatabaseBlockModel } from '@linvo/linvo-model';
import { SlashMenuConfigExtension } from '@linvo/linvo-widget-slash-menu';
import { BlockViewExtension, FlavourExtension } from '@linvo/std';
import { literal } from 'lit/static-html.js';
import { z } from 'zod';

import { DatabaseConfigExtension } from './config';
import { databaseSlashMenuConfig } from './configs/slash-menu.js';
import { effects } from './effects';

const optionsSchema = z.object({
  configure: z
    .function()
    .args(z.instanceof(DatabaseBlockModel), z.custom<MenuOptions>())
    .returns(z.custom<MenuOptions>()),
});

export type DatabaseViewExtensionOptions = z.infer<typeof optionsSchema>;

export class DatabaseViewExtension extends ViewExtensionProvider<DatabaseViewExtensionOptions> {
  override name = 'linvo-database-block';

  override schema = optionsSchema;

  override effect() {
    super.effect();
    effects();
  }

  override setup(
    context: ViewExtensionContext,
    options?: DatabaseViewExtensionOptions
  ) {
    super.setup(context);
    context.register([
      FlavourExtension('linvo:database'),
      BlockViewExtension('linvo:database', literal`linvo-database`),
      SlashMenuConfigExtension('linvo:database', databaseSlashMenuConfig),
    ]);
    if (options) {
      context.register(
        DatabaseConfigExtension({ configure: options.configure })
      );
    }
  }
}

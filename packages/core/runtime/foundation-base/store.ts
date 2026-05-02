import {
  type StoreExtensionContext,
  StoreExtensionProvider,
} from '@linvo-core/composition';
import {
  HtmlAdapterFactoryExtension,
  ImageProxyService,
  MarkdownAdapterFactoryExtension,
  MixTextAdapterFactoryExtension,
  NotionHtmlAdapterFactoryExtension,
  NotionTextAdapterFactoryExtension,
  PlainTextAdapterFactoryExtension,
} from '@linvo-core/shared/adapters';
import { HighlightSelectionExtension } from '@linvo-core/shared/selection';
import {
  BlockMetaService,
  FeatureFlagService,
} from '@linvo-core/shared/services';
import {
  BlockSelectionExtension,
  CursorSelectionExtension,
  SurfaceSelectionExtension,
  TextSelectionExtension,
} from '@linvo-core/std';

export class FoundationStoreExtension extends StoreExtensionProvider {
  override name = 'foundation';

  override setup(context: StoreExtensionContext) {
    super.setup(context);
    context.register([
      // predefined selections
      BlockSelectionExtension,
      TextSelectionExtension,
      SurfaceSelectionExtension,
      CursorSelectionExtension,
      HighlightSelectionExtension,

      // predefined adapters
      MarkdownAdapterFactoryExtension,
      PlainTextAdapterFactoryExtension,
      HtmlAdapterFactoryExtension,
      NotionTextAdapterFactoryExtension,
      NotionHtmlAdapterFactoryExtension,
      MixTextAdapterFactoryExtension,

      // shared services
      FeatureFlagService,
      BlockMetaService,
      // TODO(@mirone): maybe merge these services into a file setting service
      ImageProxyService,
    ]);
  }
}

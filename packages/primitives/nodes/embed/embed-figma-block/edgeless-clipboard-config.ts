import { EdgelessClipboardConfig } from '@linvo-core/block-surface';
import { type BlockSnapshot } from '@linvo-core/store';

export class EdgelessClipboardEmbedFigmaConfig extends EdgelessClipboardConfig {
  static override readonly key = 'linvo:embed-figma';

  override createBlock(figmaEmbed: BlockSnapshot): string | null {
    if (!this.surface) return null;
    const { xywh, style, url, caption, title, description } = figmaEmbed.props;

    const embedFigmaId = this.crud.addBlock(
      'linvo:embed-figma',
      {
        xywh,
        style,
        url,
        caption,
        title,
        description,
      },
      this.surface.model.id
    );
    return embedFigmaId;
  }
}

import { EdgelessClipboardConfig } from '@linvo-core/block-surface';
import { type BlockSnapshot } from '@linvo-core/store';

export class EdgelessClipboardEmbedLoomConfig extends EdgelessClipboardConfig {
  static override readonly key = 'linvo:embed-loom';

  override createBlock(loomEmbed: BlockSnapshot): string | null {
    if (!this.surface) return null;
    const { xywh, style, url, caption, videoId, image, title, description } =
      loomEmbed.props;

    const embedLoomId = this.crud.addBlock(
      'linvo:embed-loom',
      {
        xywh,
        style,
        url,
        caption,
        videoId,
        image,
        title,
        description,
      },
      this.surface.model.id
    );
    return embedLoomId;
  }
}

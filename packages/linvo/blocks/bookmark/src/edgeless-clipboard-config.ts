import { EdgelessClipboardConfig } from '@linvo/linvo-block-surface';
import { type BlockSnapshot } from '@linvo/store';

export class EdgelessClipboardBookmarkConfig extends EdgelessClipboardConfig {
  static override readonly key = 'linvo:bookmark';

  override createBlock(bookmark: BlockSnapshot): string | null {
    if (!this.surface) return null;

    const { xywh, style, url, caption, description, icon, image, title } =
      bookmark.props;

    const bookmarkId = this.crud.addBlock(
      'linvo:bookmark',
      {
        xywh,
        style,
        url,
        caption,
        description,
        icon,
        image,
        title,
      },
      this.surface.model.id
    );
    return bookmarkId;
  }
}

import { EdgelessClipboardConfig } from '@linvo-core/block-surface';
import { type BlockSnapshot } from '@linvo-core/store';

export class EdgelessClipboardEmbedHtmlConfig extends EdgelessClipboardConfig {
  static override readonly key = 'linvo:embed-html';

  override createBlock(htmlEmbed: BlockSnapshot): string | null {
    if (!this.surface) return null;
    const { xywh, style, caption, html, design } = htmlEmbed.props;

    const embedHtmlId = this.crud.addBlock(
      'linvo:embed-html',
      {
        xywh,
        style,
        caption,
        html,
        design,
      },
      this.surface.model.id
    );
    return embedHtmlId;
  }
}

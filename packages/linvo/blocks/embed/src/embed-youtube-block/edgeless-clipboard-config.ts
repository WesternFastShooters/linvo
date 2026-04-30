import { EdgelessClipboardConfig } from '@linvo/linvo-block-surface';
import { type BlockSnapshot } from '@linvo/store';

export class EdgelessClipboardEmbedYoutubeConfig extends EdgelessClipboardConfig {
  static override readonly key = 'linvo:embed-youtube';

  override createBlock(youtubeEmbed: BlockSnapshot): string | null {
    if (!this.surface) return null;
    const {
      xywh,
      style,
      url,
      caption,
      videoId,
      image,
      title,
      description,
      creator,
      creatorUrl,
      creatorImage,
    } = youtubeEmbed.props;

    const embedYoutubeId = this.crud.addBlock(
      'linvo:embed-youtube',
      {
        xywh,
        style,
        url,
        caption,
        videoId,
        image,
        title,
        description,
        creator,
        creatorUrl,
        creatorImage,
      },
      this.surface.model.id
    );
    return embedYoutubeId;
  }
}

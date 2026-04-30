import { ImageLayoutPainterExtension } from '@linvo/linvo-block-image/turbo-painter';
import { ListLayoutPainterExtension } from '@linvo/linvo-block-list/turbo-painter';
import { NoteLayoutPainterExtension } from '@linvo/linvo-block-note/turbo-painter';
import { ParagraphLayoutPainterExtension } from '@linvo/linvo-block-paragraph/turbo-painter';
import { ViewportLayoutPainter } from '@linvo/linvo-gfx-turbo-renderer/painter';

new ViewportLayoutPainter([
  ParagraphLayoutPainterExtension,
  ListLayoutPainterExtension,
  NoteLayoutPainterExtension,
  ImageLayoutPainterExtension,
]);

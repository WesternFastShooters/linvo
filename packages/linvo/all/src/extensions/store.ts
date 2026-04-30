import { AttachmentStoreExtension } from '@linvo/linvo-block-attachment/store';
import { BookmarkStoreExtension } from '@linvo/linvo-block-bookmark/store';
import { CalloutStoreExtension } from '@linvo/linvo-block-callout/store';
import { CodeStoreExtension } from '@linvo/linvo-block-code/store';
import { DataViewStoreExtension } from '@linvo/linvo-block-data-view/store';
import { DatabaseStoreExtension } from '@linvo/linvo-block-database/store';
import { DividerStoreExtension } from '@linvo/linvo-block-divider/store';
import { EdgelessTextStoreExtension } from '@linvo/linvo-block-edgeless-text/store';
import { EmbedStoreExtension } from '@linvo/linvo-block-embed/store';
import { EmbedDocStoreExtension } from '@linvo/linvo-block-embed-doc/store';
import { FrameStoreExtension } from '@linvo/linvo-block-frame/store';
import { ImageStoreExtension } from '@linvo/linvo-block-image/store';
import { LatexStoreExtension } from '@linvo/linvo-block-latex/store';
import { ListStoreExtension } from '@linvo/linvo-block-list/store';
import { NoteStoreExtension } from '@linvo/linvo-block-note/store';
import { ParagraphStoreExtension } from '@linvo/linvo-block-paragraph/store';
import { RootStoreExtension } from '@linvo/linvo-block-root/store';
import { SurfaceStoreExtension } from '@linvo/linvo-block-surface/store';
import { SurfaceRefStoreExtension } from '@linvo/linvo-block-surface-ref/store';
import { TableStoreExtension } from '@linvo/linvo-block-table/store';
import { FoundationStoreExtension } from '@linvo/linvo-foundation/store';
import { BrushStoreExtension } from '@linvo/linvo-gfx-brush/store';
import { ConnectorStoreExtension } from '@linvo/linvo-gfx-connector/store';
import { GroupStoreExtension } from '@linvo/linvo-gfx-group/store';
import { MindmapStoreExtension } from '@linvo/linvo-gfx-mindmap/store';
import { ShapeStoreExtension } from '@linvo/linvo-gfx-shape/store';
import { TextStoreExtension } from '@linvo/linvo-gfx-text/store';
import { FootnoteStoreExtension } from '@linvo/linvo-inline-footnote/store';
import { LatexStoreExtension as InlineLatexStoreExtension } from '@linvo/linvo-inline-latex/store';
import { LinkStoreExtension } from '@linvo/linvo-inline-link/store';
import { InlinePresetStoreExtension } from '@linvo/linvo-inline-preset/store';
import { ReferenceStoreExtension } from '@linvo/linvo-inline-reference/store';

export function getInternalStoreExtensions() {
  return [
    FoundationStoreExtension,

    AttachmentStoreExtension,
    BookmarkStoreExtension,
    CalloutStoreExtension,
    CodeStoreExtension,
    DataViewStoreExtension,
    DatabaseStoreExtension,
    DividerStoreExtension,
    EdgelessTextStoreExtension,
    EmbedStoreExtension,
    EmbedDocStoreExtension,
    FrameStoreExtension,
    ImageStoreExtension,
    LatexStoreExtension,
    ListStoreExtension,
    NoteStoreExtension,
    ParagraphStoreExtension,
    SurfaceRefStoreExtension,
    TableStoreExtension,
    SurfaceStoreExtension,
    RootStoreExtension,

    FootnoteStoreExtension,
    LinkStoreExtension,
    ReferenceStoreExtension,
    InlineLatexStoreExtension,
    InlinePresetStoreExtension,

    BrushStoreExtension,
    ShapeStoreExtension,
    MindmapStoreExtension,
    ConnectorStoreExtension,
    GroupStoreExtension,
    TextStoreExtension,
  ];
}

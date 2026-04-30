import { AttachmentViewExtension } from '@linvo/linvo-block-attachment/view';
import { BookmarkViewExtension } from '@linvo/linvo-block-bookmark/view';
import { CalloutViewExtension } from '@linvo/linvo-block-callout/view';
import { CodeBlockViewExtension } from '@linvo/linvo-block-code/view';
import { DataViewViewExtension } from '@linvo/linvo-block-data-view/view';
import { DatabaseViewExtension } from '@linvo/linvo-block-database/view';
import { DividerViewExtension } from '@linvo/linvo-block-divider/view';
import { EdgelessTextViewExtension } from '@linvo/linvo-block-edgeless-text/view';
import { EmbedViewExtension } from '@linvo/linvo-block-embed/view';
import { EmbedDocViewExtension } from '@linvo/linvo-block-embed-doc/view';
import { FrameViewExtension } from '@linvo/linvo-block-frame/view';
import { ImageViewExtension } from '@linvo/linvo-block-image/view';
import { LatexViewExtension } from '@linvo/linvo-block-latex/view';
import { ListViewExtension } from '@linvo/linvo-block-list/view';
import { NoteViewExtension } from '@linvo/linvo-block-note/view';
import { ParagraphViewExtension } from '@linvo/linvo-block-paragraph/view';
import { RootViewExtension } from '@linvo/linvo-block-root/view';
import { SurfaceViewExtension } from '@linvo/linvo-block-surface/view';
import { SurfaceRefViewExtension } from '@linvo/linvo-block-surface-ref/view';
import { TableViewExtension } from '@linvo/linvo-block-table/view';
import { FoundationViewExtension } from '@linvo/linvo-foundation/view';
import { AdapterPanelViewExtension } from '@linvo/linvo-fragment-adapter-panel/view';
import { DocTitleViewExtension } from '@linvo/linvo-fragment-doc-title/view';
import { FramePanelViewExtension } from '@linvo/linvo-fragment-frame-panel/view';
import { OutlineViewExtension } from '@linvo/linvo-fragment-outline/view';
import { BrushViewExtension } from '@linvo/linvo-gfx-brush/view';
import { ConnectorViewExtension } from '@linvo/linvo-gfx-connector/view';
import { GroupViewExtension } from '@linvo/linvo-gfx-group/view';
import { LinkViewExtension as GfxLinkViewExtension } from '@linvo/linvo-gfx-link/view';
import { MindmapViewExtension } from '@linvo/linvo-gfx-mindmap/view';
import { NoteViewExtension as GfxNoteViewExtension } from '@linvo/linvo-gfx-note/view';
import { PointerViewExtension } from '@linvo/linvo-gfx-pointer/view';
import { ShapeViewExtension } from '@linvo/linvo-gfx-shape/view';
import { TemplateViewExtension } from '@linvo/linvo-gfx-template/view';
import { TextViewExtension } from '@linvo/linvo-gfx-text/view';
import { InlineCommentViewExtension } from '@linvo/linvo-inline-comment/view';
import { FootnoteViewExtension } from '@linvo/linvo-inline-footnote/view';
import { LatexViewExtension as InlineLatexViewExtension } from '@linvo/linvo-inline-latex/view';
import { LinkViewExtension } from '@linvo/linvo-inline-link/view';
import { MentionViewExtension } from '@linvo/linvo-inline-mention/view';
import { InlinePresetViewExtension } from '@linvo/linvo-inline-preset/view';
import { ReferenceViewExtension } from '@linvo/linvo-inline-reference/view';
import { DragHandleViewExtension } from '@linvo/linvo-widget-drag-handle/view';
import { EdgelessAutoConnectViewExtension } from '@linvo/linvo-widget-edgeless-auto-connect/view';
import { EdgelessDraggingAreaViewExtension } from '@linvo/linvo-widget-edgeless-dragging-area/view';
import { EdgelessSelectedRectViewExtension } from '@linvo/linvo-widget-edgeless-selected-rect/view';
import { EdgelessToolbarViewExtension } from '@linvo/linvo-widget-edgeless-toolbar/view';
import { EdgelessZoomToolbarViewExtension } from '@linvo/linvo-widget-edgeless-zoom-toolbar/view';
import { FrameTitleViewExtension } from '@linvo/linvo-widget-frame-title/view';
import { KeyboardToolbarViewExtension } from '@linvo/linvo-widget-keyboard-toolbar/view';
import { LinkedDocViewExtension } from '@linvo/linvo-widget-linked-doc/view';
import { NoteSlicerViewExtension } from '@linvo/linvo-widget-note-slicer/view';
import { PageDraggingAreaViewExtension } from '@linvo/linvo-widget-page-dragging-area/view';
import { RemoteSelectionViewExtension } from '@linvo/linvo-widget-remote-selection/view';
import { ScrollAnchoringViewExtension } from '@linvo/linvo-widget-scroll-anchoring/view';
import { SlashMenuViewExtension } from '@linvo/linvo-widget-slash-menu/view';
import { ToolbarViewExtension } from '@linvo/linvo-widget-toolbar/view';
import { ViewportOverlayViewExtension } from '@linvo/linvo-widget-viewport-overlay/view';

export function getInternalViewExtensions() {
  return [
    FoundationViewExtension,

    // Gfx
    PointerViewExtension,
    GfxNoteViewExtension,
    BrushViewExtension,
    ShapeViewExtension,
    MindmapViewExtension,
    ConnectorViewExtension,
    GroupViewExtension,
    TextViewExtension,
    TemplateViewExtension,
    GfxLinkViewExtension,

    // Block
    AttachmentViewExtension,
    BookmarkViewExtension,
    CalloutViewExtension,
    CodeBlockViewExtension,
    DataViewViewExtension,
    DatabaseViewExtension,
    DividerViewExtension,
    EdgelessTextViewExtension,
    EmbedViewExtension,
    EmbedDocViewExtension,
    FrameViewExtension,
    ImageViewExtension,
    LatexViewExtension,
    ListViewExtension,
    NoteViewExtension,
    ParagraphViewExtension,
    SurfaceRefViewExtension,
    TableViewExtension,
    SurfaceViewExtension,
    RootViewExtension,

    // Inline
    InlineCommentViewExtension,
    FootnoteViewExtension,
    LinkViewExtension,
    ReferenceViewExtension,
    InlineLatexViewExtension,
    MentionViewExtension,
    InlinePresetViewExtension,

    // Widget
    // order will affect the z-index of the widget
    DragHandleViewExtension,
    EdgelessAutoConnectViewExtension,
    FrameTitleViewExtension,
    KeyboardToolbarViewExtension,
    LinkedDocViewExtension,
    RemoteSelectionViewExtension,
    ScrollAnchoringViewExtension,
    SlashMenuViewExtension,
    ToolbarViewExtension,
    ViewportOverlayViewExtension,
    EdgelessZoomToolbarViewExtension,
    PageDraggingAreaViewExtension,
    EdgelessSelectedRectViewExtension,
    EdgelessDraggingAreaViewExtension,
    NoteSlicerViewExtension,
    EdgelessToolbarViewExtension,

    // Fragment
    DocTitleViewExtension,
    FramePanelViewExtension,
    OutlineViewExtension,
    AdapterPanelViewExtension,
  ];
}

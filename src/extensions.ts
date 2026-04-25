import { AttachmentStoreExtension } from '@blocksuite/affine/blocks/attachment/store';
import { AttachmentViewExtension } from '@blocksuite/affine/blocks/attachment/view';
import { BookmarkStoreExtension } from '@blocksuite/affine/blocks/bookmark/store';
import { BookmarkViewExtension } from '@blocksuite/affine/blocks/bookmark/view';
import { CodeStoreExtension } from '@blocksuite/affine/blocks/code/store';
import { CodeBlockViewExtension } from '@blocksuite/affine/blocks/code/view';
import { DividerStoreExtension } from '@blocksuite/affine/blocks/divider/store';
import { DividerViewExtension } from '@blocksuite/affine/blocks/divider/view';
import { EmbedStoreExtension } from '@blocksuite/affine/blocks/embed/store';
import { EmbedViewExtension } from '@blocksuite/affine/blocks/embed/view';
import { EmbedDocStoreExtension } from '@blocksuite/affine/blocks/embed-doc/store';
import { EmbedDocViewExtension } from '@blocksuite/affine/blocks/embed-doc/view';
import { FrameStoreExtension } from '@blocksuite/affine/blocks/frame/store';
import { FrameViewExtension } from '@blocksuite/affine/blocks/frame/view';
import { ImageStoreExtension } from '@blocksuite/affine/blocks/image/store';
import { ImageViewExtension } from '@blocksuite/affine/blocks/image/view';
import { ListStoreExtension } from '@blocksuite/affine/blocks/list/store';
import { ListViewExtension } from '@blocksuite/affine/blocks/list/view';
import { NoteStoreExtension } from '@blocksuite/affine/blocks/note/store';
import { NoteViewExtension } from '@blocksuite/affine/blocks/note/view';
import { ParagraphStoreExtension } from '@blocksuite/affine/blocks/paragraph/store';
import { ParagraphViewExtension } from '@blocksuite/affine/blocks/paragraph/view';
import { BrushStoreExtension } from '@blocksuite/affine/gfx/brush/store';
import { BrushViewExtension } from '@blocksuite/affine/gfx/brush/view';
import { ConnectorStoreExtension } from '@blocksuite/affine/gfx/connector/store';
import { ConnectorViewExtension } from '@blocksuite/affine/gfx/connector/view';
import { GroupStoreExtension } from '@blocksuite/affine/gfx/group/store';
import { GroupViewExtension } from '@blocksuite/affine/gfx/group/view';
import { MindmapStoreExtension } from '@blocksuite/affine/gfx/mindmap/store';
import { MindmapViewExtension } from '@blocksuite/affine/gfx/mindmap/view';
import { NoteViewExtension as GfxNoteViewExtension } from '@blocksuite/affine/gfx/note/view';
import { PointerViewExtension } from '@blocksuite/affine/gfx/pointer/view';
import { ShapeStoreExtension } from '@blocksuite/affine/gfx/shape/store';
import { ShapeViewExtension } from '@blocksuite/affine/gfx/shape/view';
import { TextStoreExtension } from '@blocksuite/affine/gfx/text/store';
import { TextViewExtension } from '@blocksuite/affine/gfx/text/view';
import { StoreExtensionManager, ViewExtensionManager } from '@blocksuite/affine/ext-loader';
import { FoundationStoreExtension } from '@blocksuite/affine/foundation/store';
import { FoundationViewExtension } from '@blocksuite/affine/foundation/view';
import { FootnoteStoreExtension } from '@blocksuite/affine/inlines/footnote/store';
import { FootnoteViewExtension } from '@blocksuite/affine/inlines/footnote/view';
import { LinkStoreExtension } from '@blocksuite/affine/inlines/link/store';
import { LinkViewExtension } from '@blocksuite/affine/inlines/link/view';
import { InlinePresetStoreExtension } from '@blocksuite/affine/inlines/preset/store';
import { InlinePresetViewExtension } from '@blocksuite/affine/inlines/preset/view';
import { ReferenceStoreExtension } from '@blocksuite/affine/inlines/reference/store';
import { ReferenceViewExtension } from '@blocksuite/affine/inlines/reference/view';
import { FrameTitleViewExtension } from '@blocksuite/affine-widget-frame-title/view';
import { KeyboardToolbarViewExtension } from '@blocksuite/affine-widget-keyboard-toolbar/view';
import { RootStoreExtension } from '@blocksuite/affine/blocks/root/store';
import { RootViewExtension } from '@blocksuite/affine/blocks/root/view';
import { SurfaceStoreExtension } from '@blocksuite/affine/blocks/surface/store';
import { SurfaceViewExtension } from '@blocksuite/affine/blocks/surface/view';
import { EdgelessAutoConnectViewExtension } from '@blocksuite/affine-widget-edgeless-auto-connect/view';
import { EdgelessDraggingAreaViewExtension } from '@blocksuite/affine-widget-edgeless-dragging-area/view';
import { EdgelessSelectedRectViewExtension } from '@blocksuite/affine-widget-edgeless-selected-rect/view';
import { EdgelessToolbarViewExtension } from '@blocksuite/affine-widget-edgeless-toolbar/view';
import { EdgelessZoomToolbarViewExtension } from '@blocksuite/affine-widget-edgeless-zoom-toolbar/view';
import { RemoteSelectionViewExtension } from '@blocksuite/affine-widget-remote-selection/view';
import { ScrollAnchoringViewExtension } from '@blocksuite/affine-widget-scroll-anchoring/view';
import { SlashMenuViewExtension } from '@blocksuite/affine-widget-slash-menu/view';
import { ToolbarViewExtension } from '@blocksuite/affine-widget-toolbar/view';
import { ViewportOverlayViewExtension } from '@blocksuite/affine-widget-viewport-overlay/view';

const whiteboardStoreExtensions = [
  FoundationStoreExtension,
  AttachmentStoreExtension,
  BookmarkStoreExtension,
  CodeStoreExtension,
  DividerStoreExtension,
  EmbedStoreExtension,
  EmbedDocStoreExtension,
  SurfaceStoreExtension,
  RootStoreExtension,
  FrameStoreExtension,
  ImageStoreExtension,
  ListStoreExtension,
  NoteStoreExtension,
  ParagraphStoreExtension,
  FootnoteStoreExtension,
  BrushStoreExtension,
  LinkStoreExtension,
  ShapeStoreExtension,
  MindmapStoreExtension,
  InlinePresetStoreExtension,
  ConnectorStoreExtension,
  GroupStoreExtension,
  ReferenceStoreExtension,
  TextStoreExtension,
];

const whiteboardViewExtensions = [
  FoundationViewExtension,
  PointerViewExtension,
  BrushViewExtension,
  ShapeViewExtension,
  MindmapViewExtension,
  ConnectorViewExtension,
  GroupViewExtension,
  TextViewExtension,
  GfxNoteViewExtension,
  AttachmentViewExtension,
  BookmarkViewExtension,
  CodeBlockViewExtension,
  DividerViewExtension,
  EmbedViewExtension,
  EmbedDocViewExtension,
  FrameViewExtension,
  ImageViewExtension,
  ListViewExtension,
  NoteViewExtension,
  ParagraphViewExtension,
  SurfaceViewExtension,
  RootViewExtension,
  FootnoteViewExtension,
  LinkViewExtension,
  ReferenceViewExtension,
  InlinePresetViewExtension,
  EdgelessAutoConnectViewExtension,
  FrameTitleViewExtension,
  KeyboardToolbarViewExtension,
  RemoteSelectionViewExtension,
  ScrollAnchoringViewExtension,
  SlashMenuViewExtension,
  ToolbarViewExtension,
  ViewportOverlayViewExtension,
  EdgelessZoomToolbarViewExtension,
  EdgelessSelectedRectViewExtension,
  EdgelessDraggingAreaViewExtension,
  EdgelessToolbarViewExtension,
];

export const whiteboardStoreExtensionManager = new StoreExtensionManager(
  whiteboardStoreExtensions
);

whiteboardStoreExtensionManager.configure(NoteStoreExtension, {
  mode: 'edgeless',
});

export const whiteboardViewExtensionManager = new ViewExtensionManager(
  whiteboardViewExtensions
);

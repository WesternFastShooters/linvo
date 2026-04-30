import { AttachmentStoreExtension } from '@linvo/linvo/blocks/attachment/store';
import { AttachmentViewExtension } from '@linvo/linvo/blocks/attachment/view';
import { BookmarkStoreExtension } from '@linvo/linvo/blocks/bookmark/store';
import { BookmarkViewExtension } from '@linvo/linvo/blocks/bookmark/view';
import { CodeStoreExtension } from '@linvo/linvo/blocks/code/store';
import { CodeBlockViewExtension } from '@linvo/linvo/blocks/code/view';
import { DividerStoreExtension } from '@linvo/linvo/blocks/divider/store';
import { DividerViewExtension } from '@linvo/linvo/blocks/divider/view';
import { EmbedStoreExtension } from '@linvo/linvo/blocks/embed/store';
import { EmbedViewExtension } from '@linvo/linvo/blocks/embed/view';
import { EmbedDocStoreExtension } from '@linvo/linvo/blocks/embed-doc/store';
import { EmbedDocViewExtension } from '@linvo/linvo/blocks/embed-doc/view';
import { FrameStoreExtension } from '@linvo/linvo/blocks/frame/store';
import { FrameViewExtension } from '@linvo/linvo/blocks/frame/view';
import { ImageStoreExtension } from '@linvo/linvo/blocks/image/store';
import { ImageViewExtension } from '@linvo/linvo/blocks/image/view';
import { ListStoreExtension } from '@linvo/linvo/blocks/list/store';
import { ListViewExtension } from '@linvo/linvo/blocks/list/view';
import { NoteStoreExtension } from '@linvo/linvo/blocks/note/store';
import { NoteViewExtension } from '@linvo/linvo/blocks/note/view';
import { ParagraphStoreExtension } from '@linvo/linvo/blocks/paragraph/store';
import { ParagraphViewExtension } from '@linvo/linvo/blocks/paragraph/view';
import { BrushStoreExtension } from '@linvo/linvo/gfx/brush/store';
import { BrushViewExtension } from '@linvo/linvo/gfx/brush/view';
import { ConnectorStoreExtension } from '@linvo/linvo/gfx/connector/store';
import { ConnectorViewExtension } from '@linvo/linvo/gfx/connector/view';
import { GroupStoreExtension } from '@linvo/linvo/gfx/group/store';
import { GroupViewExtension } from '@linvo/linvo/gfx/group/view';
import { MindmapStoreExtension } from '@linvo/linvo/gfx/mindmap/store';
import { MindmapViewExtension } from '@linvo/linvo/gfx/mindmap/view';
import { NoteViewExtension as GfxNoteViewExtension } from '@linvo/linvo/gfx/note/view';
import { PointerViewExtension } from '@linvo/linvo/gfx/pointer/view';
import { ShapeStoreExtension } from '@linvo/linvo/gfx/shape/store';
import { ShapeViewExtension } from '@linvo/linvo/gfx/shape/view';
import { TextStoreExtension } from '@linvo/linvo/gfx/text/store';
import { TextViewExtension } from '@linvo/linvo/gfx/text/view';
import { StoreExtensionManager, ViewExtensionManager } from '@linvo/linvo/ext-loader';
import { FoundationStoreExtension } from '@linvo/linvo/foundation/store';
import { FoundationViewExtension } from '@linvo/linvo/foundation/view';
import { FootnoteStoreExtension } from '@linvo/linvo/inlines/footnote/store';
import { FootnoteViewExtension } from '@linvo/linvo/inlines/footnote/view';
import { LinkStoreExtension } from '@linvo/linvo/inlines/link/store';
import { LinkViewExtension } from '@linvo/linvo/inlines/link/view';
import { InlinePresetStoreExtension } from '@linvo/linvo/inlines/preset/store';
import { InlinePresetViewExtension } from '@linvo/linvo/inlines/preset/view';
import { ReferenceStoreExtension } from '@linvo/linvo/inlines/reference/store';
import { ReferenceViewExtension } from '@linvo/linvo/inlines/reference/view';
import { FrameTitleViewExtension } from '@linvo/linvo-widget-frame-title/view';
import { KeyboardToolbarViewExtension } from '@linvo/linvo-widget-keyboard-toolbar/view';
import { RootStoreExtension } from '@linvo/linvo/blocks/root/store';
import { RootViewExtension } from '@linvo/linvo/blocks/root/view';
import { SurfaceStoreExtension } from '@linvo/linvo/blocks/surface/store';
import { SurfaceViewExtension } from '@linvo/linvo/blocks/surface/view';
import { EdgelessAutoConnectViewExtension } from '@linvo/linvo-widget-edgeless-auto-connect/view';
import { EdgelessDraggingAreaViewExtension } from '@linvo/linvo-widget-edgeless-dragging-area/view';
import { EdgelessSelectedRectViewExtension } from '@linvo/linvo-widget-edgeless-selected-rect/view';
import { EdgelessToolbarViewExtension } from '@linvo/linvo-widget-edgeless-toolbar/view';
import { EdgelessZoomToolbarViewExtension } from '@linvo/linvo-widget-edgeless-zoom-toolbar/view';
import { RemoteSelectionViewExtension } from '@linvo/linvo-widget-remote-selection/view';
import { ScrollAnchoringViewExtension } from '@linvo/linvo-widget-scroll-anchoring/view';
import { SlashMenuViewExtension } from '@linvo/linvo-widget-slash-menu/view';
import { ToolbarViewExtension } from '@linvo/linvo-widget-toolbar/view';
import { ViewportOverlayViewExtension } from '@linvo/linvo-widget-viewport-overlay/view';

import { MermaidViewExtension } from './mermaid/view';

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
  MermaidViewExtension,
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

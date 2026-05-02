import { AttachmentStoreExtension } from '@linvo-primitives/attachment/store';
import { AttachmentWhiteboardViewExtension } from '@linvo-primitives/attachment/whiteboard-view';
import { EmbedStoreExtension } from '@linvo-primitives/embed/store';
import { EmbedViewExtension } from '@linvo-primitives/embed/view';
import { FrameStoreExtension } from '@linvo-primitives/frame/store';
import { FrameViewExtension } from '@linvo-primitives/frame/view';
import { ImageStoreExtension } from '@linvo-primitives/image/store';
import { ImageWhiteboardViewExtension } from '@linvo-primitives/image/whiteboard-view';
import { RootStoreExtension } from '@linvo-core/block-root/store';
import { RootViewExtension } from '@linvo-core/block-root/view';
import { SurfaceStoreExtension } from '@linvo-core/block-surface/store';
import { SurfaceViewExtension } from '@linvo-core/block-surface/view';
import { StoreExtensionManager, ViewExtensionManager } from '@linvo-core/composition';
import { FoundationStoreExtension } from '@linvo-core/foundation/store';
import { FoundationViewExtension } from '@linvo-core/foundation/view';
import { BrushStoreExtension } from '@linvo-primitives/brush/store';
import { BrushViewExtension } from '@linvo-primitives/brush/view';
import { ConnectorStoreExtension } from '@linvo-primitives/connector/store';
import { ConnectorViewExtension } from '@linvo-primitives/connector/view';
import { GroupStoreExtension } from '@linvo-primitives/group/store';
import { GroupViewExtension } from '@linvo-primitives/group/view';
import { MindmapStoreExtension } from '@linvo-primitives/mindmap/store';
import { MindmapViewExtension } from '@linvo-primitives/mindmap/view';
import { PointerViewExtension } from '@linvo-primitives/pointer/view';
import { ShapeStoreExtension } from '@linvo-primitives/shape/store';
import { ShapeViewExtension } from '@linvo-primitives/shape/view';
import { TextStoreExtension } from '@linvo-primitives/text/store';
import { TextViewExtension } from '@linvo-primitives/text/view';
import { FrameTitleViewExtension } from '@linvo-ui/frame-title/view';
import { EdgelessDraggingAreaViewExtension } from '@linvo-ui/edgeless-dragging-area/view';
import { EdgelessSelectedRectViewExtension } from '@linvo-ui/edgeless-selected-rect/view';
import { EdgelessToolbarViewExtension } from '@linvo-ui/edgeless-toolbar/view';
import { EdgelessZoomToolbarViewExtension } from '@linvo-ui/edgeless-zoom-toolbar/view';
import { ScrollAnchoringViewExtension } from '@linvo-ui/scroll-anchoring/view';
import { ViewportOverlayViewExtension } from '@linvo-ui/viewport-overlay/view';

import { MermaidViewExtension } from '@linvo-integrations/mermaid/view';

const whiteboardStoreExtensions = [
  FoundationStoreExtension,
  AttachmentStoreExtension,
  EmbedStoreExtension,
  SurfaceStoreExtension,
  RootStoreExtension,
  FrameStoreExtension,
  ImageStoreExtension,
  BrushStoreExtension,
  ShapeStoreExtension,
  MindmapStoreExtension,
  ConnectorStoreExtension,
  GroupStoreExtension,
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
  AttachmentWhiteboardViewExtension,
  EmbedViewExtension,
  FrameViewExtension,
  ImageWhiteboardViewExtension,
  SurfaceViewExtension,
  RootViewExtension,
  FrameTitleViewExtension,
  ScrollAnchoringViewExtension,
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

export const whiteboardViewExtensionManager = new ViewExtensionManager(
  whiteboardViewExtensions
);

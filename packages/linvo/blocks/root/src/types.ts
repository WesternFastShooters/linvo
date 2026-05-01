import type { EdgelessRootBlockComponent } from './edgeless/edgeless-root-block.js';
import type { PreviewRootBlockComponent } from './preview/preview-root-block.js';

export type RootBlockComponent =
  | PreviewRootBlockComponent
  | EdgelessRootBlockComponent;

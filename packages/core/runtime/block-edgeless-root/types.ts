import type { EdgelessRootBlockComponent } from './edgeless/edgeless-root-block';
import type { PreviewRootBlockComponent } from './preview/preview-root-block';

export type RootBlockComponent =
  | PreviewRootBlockComponent
  | EdgelessRootBlockComponent;

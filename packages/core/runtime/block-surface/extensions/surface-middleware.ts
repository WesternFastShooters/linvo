import { createIdentifier } from '@linvo-core/composition/di';
import type { ExtensionType } from '@linvo-core/store';

import type { SurfaceBlockModel } from '../surface-model';

export type SurfaceMiddleware = (surface: SurfaceBlockModel) => () => void;

export const surfaceMiddlewareIdentifier = createIdentifier<{
  middleware: SurfaceMiddleware;
}>('surface-middleware');

export function surfaceMiddlewareExtension(
  id: string,
  middleware: SurfaceMiddleware
): ExtensionType {
  return {
    setup: di => {
      di.addImpl(surfaceMiddlewareIdentifier(id), {
        middleware,
      });
    },
  };
}

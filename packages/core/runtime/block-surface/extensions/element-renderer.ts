import {
  createIdentifier,
  type ServiceIdentifier,
} from '@linvo-core/composition/di';
import type {
  GfxLocalElementModel,
  GfxPrimitiveElementModel,
} from '@linvo-core/std/gfx';
import type { ExtensionType } from '@linvo-core/store';

import type { ElementRenderer } from '../renderer/elements';

export const ElementRendererIdentifier =
  createIdentifier<unknown>('element-renderer');

export const ElementRendererExtension = <
  T extends GfxPrimitiveElementModel | GfxLocalElementModel,
>(
  id: string,
  renderer: ElementRenderer<T>
): ExtensionType & {
  identifier: ServiceIdentifier<ElementRenderer<T>>;
} => {
  const identifier = ElementRendererIdentifier<ElementRenderer<T>>(id);
  return {
    setup: di => {
      di.addImpl(identifier, () => renderer);
    },
    identifier,
  };
};

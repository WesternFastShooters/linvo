import type { Connectable } from '@linvo-core/content';
import type { GfxModel } from '@linvo-core/std/gfx';

import type { EdgelessRootBlockComponent } from '../edgeless-root-block';

/**
 * Use deleteElementsV2 instead.
 * @deprecated
 */
export function deleteElements(
  edgeless: EdgelessRootBlockComponent,
  elements: GfxModel[]
) {
  const set = new Set(elements);
  const { service } = edgeless;

  elements.forEach(element => {
    if (element.connectable) {
      const connectors = service.getConnectors(element as Connectable);
      connectors.forEach(connector => set.add(connector));
    }
  });

  set.forEach(element => {
    service.removeElement(element.id);
  });
}

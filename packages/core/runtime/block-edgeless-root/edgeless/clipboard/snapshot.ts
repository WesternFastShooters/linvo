import type { LocalSurfaceModel } from '@linvo-core/content';
import type {
  LocalElementSnapshot,
  LocalSurfaceSnapshot,
} from '@linvo-core/shared/whiteboard/types';
import { createElementId } from '@linvo-core/shared/whiteboard/utils';

function remapContainerKeys(
  snapshot: LocalElementSnapshot,
  idMap: Map<string, string>
) {
  const children = snapshot.children as Record<string, unknown> | undefined;
  if (children && typeof children === 'object' && !Array.isArray(children)) {
    snapshot.children = Object.fromEntries(
      Object.entries(children).map(([key, value]) => [idMap.get(key) ?? key, value])
    ) as never;
  }

  const childElementIds = snapshot.childElementIds as
    | Record<string, unknown>
    | undefined;
  if (
    childElementIds &&
    typeof childElementIds === 'object' &&
    !Array.isArray(childElementIds)
  ) {
    snapshot.childElementIds = Object.fromEntries(
      Object.entries(childElementIds).map(([key, value]) => [
        idMap.get(key) ?? key,
        value,
      ])
    ) as never;
  }
}

function remapNestedReferences(
  value: unknown,
  idMap: Map<string, string>
): unknown {
  if (Array.isArray(value)) {
    return value.map(item => remapNestedReferences(item, idMap));
  }

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    return Object.fromEntries(
      Object.entries(record).map(([key, item]) => {
        if (key === 'id' && typeof item === 'string') {
          return [key, idMap.get(item) ?? item];
        }

        if (key === 'parent' && typeof item === 'string') {
          return [key, idMap.get(item) ?? item];
        }

        return [key, remapNestedReferences(item, idMap)];
      })
    ) as Record<string, unknown>;
  }

  return value;
}

export function createClipboardSnapshot(
  surface: LocalSurfaceModel,
  ids: string[]
): LocalSurfaceSnapshot {
  const filteredIds = surface.elementIds.filter(id => ids.includes(id));
  const elements = Object.fromEntries(
    filteredIds.map(id => [id, surface.getElementSnapshot(id)!])
  );

  return {
    elementOrder: filteredIds,
    elements,
    version: 1,
  };
}

export function pasteClipboardSnapshot(
  surface: LocalSurfaceModel,
  snapshot: LocalSurfaceSnapshot,
  options: {
    regenerateIds?: boolean;
  } = {}
) {
  if (options.regenerateIds === false) {
    surface.importSnapshot(snapshot, {
      label: 'paste-clipboard',
      replace: false,
    });
    return snapshot;
  }

  const idMap = new Map<string, string>();
  snapshot.elementOrder.forEach(id => {
    idMap.set(id, createElementId());
  });

  const elements = Object.fromEntries(
    snapshot.elementOrder.flatMap(id => {
      const current = snapshot.elements[id];
      if (!current) {
        return [];
      }

      const element = structuredClone(current);
      const nextId = idMap.get(id)!;
      element.id = nextId;
      remapContainerKeys(element, idMap);
      Object.entries(element).forEach(([key, value]) => {
        if (key === 'children' || key === 'childElementIds') {
          return;
        }
        element[key] = remapNestedReferences(value, idMap) as never;
      });
      return [[nextId, element] as const];
    })
  );

  const nextSnapshot: LocalSurfaceSnapshot = {
    elementOrder: snapshot.elementOrder.map(id => idMap.get(id)!),
    elements,
    version: 1,
  };

  surface.importSnapshot(nextSnapshot, {
    label: 'paste-clipboard',
    replace: false,
  });

  return nextSnapshot;
}

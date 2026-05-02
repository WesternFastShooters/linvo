import { PlainText } from '@linvo-core/store/reactive/text';
import type {
  LocalElementSnapshot,
  LocalSurfaceSnapshot,
  LocalValue,
} from '@linvo-core/shared/whiteboard/types';

export const LEGACY_SURFACE_TEXT_UNIQ_IDENTIFIER = 'linvo:surface:text';
export const LEGACY_SURFACE_YMAP_UNIQ_IDENTIFIER = 'linvo:surface:ymap';

function convertLegacyValue(value: unknown): LocalValue {
  if (Array.isArray(value)) {
    return value.map(item => convertLegacyValue(item));
  }

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    if (record[LEGACY_SURFACE_TEXT_UNIQ_IDENTIFIER]) {
      return PlainText.from(record.delta as string | Array<{ insert: string }>).toJSON();
    }

    if (record[LEGACY_SURFACE_YMAP_UNIQ_IDENTIFIER]) {
      return Object.fromEntries(
        Object.entries((record.json as Record<string, unknown>) ?? {}).map(
          ([key, item]) => [key, convertLegacyValue(item)]
        )
      );
    }

    return Object.fromEntries(
      Object.entries(record).map(([key, item]) => [key, convertLegacyValue(item)])
    ) as LocalValue;
  }

  return value as LocalValue;
}

export function importLegacySurfaceSnapshot(
  legacy:
    | {
        elements?: Record<string, Record<string, unknown>>;
      }
    | LocalSurfaceSnapshot
): LocalSurfaceSnapshot {
  if ('version' in legacy && legacy.version === 1 && 'elementOrder' in legacy) {
    return legacy;
  }

  const elements = Object.fromEntries(
    Object.entries(legacy.elements ?? {}).map(([id, element]) => {
      const nextElement = convertLegacyValue(element) as LocalElementSnapshot;
      nextElement.id = id;
      return [id, nextElement];
    })
  );

  const elementOrder = Object.values(elements)
    .sort((left, right) => {
      const leftIndex = typeof left.index === 'string' ? left.index : '';
      const rightIndex = typeof right.index === 'string' ? right.index : '';
      return leftIndex.localeCompare(rightIndex);
    })
    .map(element => element.id);

  return {
    elementOrder,
    elements,
    version: 1,
  };
}

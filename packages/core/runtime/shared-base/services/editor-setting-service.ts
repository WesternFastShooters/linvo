import { createIdentifier } from '@linvo-core/composition/di';
import type { DeepPartial } from '@linvo-core/global/utils';
import type { ExtensionType } from '@linvo-core/store';
import type { Signal } from '@preact/signals-core';
import { z } from 'zod';

import { NodePropsSchema } from '../utils';

export const GeneralSettingSchema = z
  .object({
    edgelessScrollZoom: z.boolean().default(false),
    edgelessDisableScheduleUpdate: z.boolean().default(false),
    docCanvasPreferView: z.enum(['linvo:embed-synced-doc']).default(
      'linvo:embed-synced-doc'
    ),
  })
  .merge(NodePropsSchema);

export type EditorSetting = z.infer<typeof GeneralSettingSchema>;

export interface EditorSettingService {
  setting$: Signal<DeepPartial<EditorSetting>>;
  set?: (
    key: keyof EditorSetting,
    value: EditorSetting[keyof EditorSetting]
  ) => void;
}

export const EditorSettingProvider = createIdentifier<EditorSettingService>(
  'LinvoEditorSettingProvider'
);

export function EditorSettingExtension(
  service: EditorSettingService
): ExtensionType {
  return {
    setup: di => {
      di.override(EditorSettingProvider, () => service);
    },
  };
}

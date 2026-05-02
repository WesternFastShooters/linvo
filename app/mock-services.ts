import {
  type DocMode,
  type ReferenceParams,
} from '@linvo-core/content';
import {
  type DocModeProvider,
  type EditorSetting,
  GeneralSettingSchema,
  type ParseDocUrlService,
} from '@linvo-core/shared/services';
import type { DocSource } from '@linvo-core/store';
import { Signal } from '@preact/signals-core';
import { Subject } from 'rxjs';

import type { LinvoEditorContainerElement } from './editor-element';

const DEFAULT_MODE: DocMode = 'edgeless';
type LinvoEditorContainer = LinvoEditorContainerElement;
const whiteboardModeSlots = new Map<string, Subject<DocMode>>();

function getWhiteboardModeMap() {
  return new Map<string, DocMode>();
}

function saveWhiteboardModeMap(_map: Map<string, DocMode>) {}

export function mockWhiteboardModeService(editor: LinvoEditorContainer) {
  const whiteboardModeService: DocModeProvider = {
    getPrimaryMode: whiteboardId => {
      try {
        const modeMap = getWhiteboardModeMap();
        return modeMap.get(whiteboardId) ?? DEFAULT_MODE;
      } catch {
        return DEFAULT_MODE;
      }
    },
    onPrimaryModeChange: (handler, whiteboardId) => {
      if (!whiteboardModeSlots.has(whiteboardId)) {
        whiteboardModeSlots.set(whiteboardId, new Subject<DocMode>());
      }
      return whiteboardModeSlots.get(whiteboardId)!.subscribe(handler);
    },
    getEditorMode: () => editor.mode,
    setEditorMode: mode => {
      editor.switchEditor(mode);
    },
    setPrimaryMode: (mode, whiteboardId) => {
      const modeMap = getWhiteboardModeMap();
      modeMap.set(whiteboardId, mode);
      saveWhiteboardModeMap(modeMap);
      whiteboardModeSlots.get(whiteboardId)?.next(mode);
    },
    togglePrimaryMode: whiteboardId => {
      const mode = DEFAULT_MODE;
      whiteboardModeService.setPrimaryMode(mode, whiteboardId);
      return mode;
    },
  };

  return whiteboardModeService;
}

export function mockParseWhiteboardUrlService(
  whiteboardDataSource: DocSource
): ParseDocUrlService {
  return {
    parseDocUrl: (url: string) => {
      if (!url || !URL.canParse(url)) {
        return;
      }
      const path = decodeURIComponent(new URL(url).hash.slice(1));
      const whiteboardRecord =
        whiteboardDataSource.doc.id === path ? whiteboardDataSource.doc : null;
      if (!whiteboardRecord) {
        return;
      }
      return {
        docId: whiteboardRecord.id,
      };
    },
  };
}

export function mockEditorSetting() {
  if (window.editorSetting$) {
    return window.editorSetting$;
  }

  const settingSchemas = GeneralSettingSchema.shape as Record<
    string,
    {
      parse(value: unknown): EditorSetting[keyof EditorSetting];
    }
  >;
  const initialValue = Object.entries(settingSchemas).reduce(
    (acc, [key, schema]) => {
      (acc as Record<string, EditorSetting[keyof EditorSetting]>)[key] =
        schema.parse(undefined);
      return acc;
    },
    {} as EditorSetting
  );

  const setting$ = new Signal<EditorSetting>(initialValue);
  window.editorSetting$ = setting$;
  return setting$;
}

export function buildWhiteboardUrl(
  whiteboardId: string,
  params?: ReferenceParams
) {
  const url = new URL(location.pathname, location.origin);
  if (params) {
    for (const [key, value] of Object.entries(
      params as Record<string, string | string[] | undefined>
    )) {
      if (value === undefined) {
        continue;
      }
      url.searchParams.set(key, Array.isArray(value) ? value.join(',') : value);
    }
  }
  url.hash = encodeURIComponent(whiteboardId);
  return url.toString();
}

import {
  type DocMode,
  type ReferenceParams,
} from '@linvo/linvo/model';
import {
  type DocModeProvider,
  type EditorSetting,
  GeneralSettingSchema,
  type ParseDocUrlService,
} from '@linvo/linvo/shared/services';
import type { Workspace } from '@linvo/linvo/store';
import type { TestLinvoEditorContainer } from '@linvo/integration-test';
import { Signal } from '@preact/signals-core';
import { Subject } from 'rxjs';

const DEFAULT_MODE: DocMode = 'edgeless';
type LinvoEditorContainer = TestLinvoEditorContainer;
const slotMap = new Map<string, Subject<DocMode>>();

function getModeFromStorage() {
  return new Map<string, DocMode>();
}

function saveModeToStorage(_map: Map<string, DocMode>) {}

export function mockDocModeService(editor: LinvoEditorContainer) {
  const docModeService: DocModeProvider = {
    getPrimaryMode: docId => {
      try {
        const modeMap = getModeFromStorage();
        return modeMap.get(docId) ?? DEFAULT_MODE;
      } catch {
        return DEFAULT_MODE;
      }
    },
    onPrimaryModeChange: (handler, docId) => {
      if (!slotMap.has(docId)) {
        slotMap.set(docId, new Subject<DocMode>());
      }
      return slotMap.get(docId)!.subscribe(handler);
    },
    getEditorMode: () => editor.mode,
    setEditorMode: mode => {
      editor.switchEditor(mode);
    },
    setPrimaryMode: (mode, docId) => {
      const modeMap = getModeFromStorage();
      modeMap.set(docId, mode);
      saveModeToStorage(modeMap);
      slotMap.get(docId)?.next(mode);
    },
    togglePrimaryMode: docId => {
      const mode = DEFAULT_MODE;
      docModeService.setPrimaryMode(mode, docId);
      return mode;
    },
  };

  return docModeService;
}

export function mockParseDocUrlService(
  collection: Workspace
): ParseDocUrlService {
  return {
    parseDocUrl: (url: string) => {
      if (!url || !URL.canParse(url)) {
        return;
      }
      const path = decodeURIComponent(new URL(url).hash.slice(1));
      const target = collection.doc.id === path ? collection.doc : null;
      if (!target) {
        return;
      }
      return {
        docId: target.id,
      };
    },
  };
}

export function mockEditorSetting() {
  if (window.editorSetting$) {
    return window.editorSetting$;
  }

  const initialValue = Object.entries(GeneralSettingSchema.shape).reduce(
    (acc, [key, schema]) => {
      (
        acc as Record<string, EditorSetting[keyof EditorSetting]>
      )[key] = schema.parse(undefined);
      return acc;
    },
    {} as EditorSetting
  );

  const setting$ = new Signal<EditorSetting>(initialValue);
  window.editorSetting$ = setting$;
  return setting$;
}

export function buildDocHash(docId: string, params?: ReferenceParams) {
  const url = new URL(location.pathname, location.origin);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, Array.isArray(value) ? value.join(',') : value);
    }
  }
  url.hash = encodeURIComponent(docId);
  return url.toString();
}

import {
  ColorScheme,
  DefaultTheme,
  FontFamily,
  ShapeStyle,
} from '@blocksuite/affine/model';
import {
  CommunityCanvasTextFonts,
  DocModeProvider,
  EditPropsStore,
  EditorSettingExtension,
  FeatureFlagService,
  FontConfigExtension,
  ThemeProvider,
} from '@blocksuite/affine/shared/services';
import type { ExtensionType, Store, Workspace } from '@blocksuite/affine/store';
import type { TestAffineEditorContainer } from '@blocksuite/integration-test';

import { whiteboardViewExtensionManager } from './extensions';
import {
  mockDocModeService,
  mockEditorSetting,
} from './mock-services';

function installEditorZoomGuards(editor: TestAffineEditorContainer) {
  const eventOptions: AddEventListenerOptions = {
    capture: true,
    passive: false,
  };

  const preventBrowserZoom = (event: WheelEvent) => {
    if (!event.ctrlKey && !event.metaKey) return;

    // Let edgeless consume the wheel event while blocking browser page zoom.
    event.preventDefault();
  };

  const preventGestureZoom = (event: Event) => {
    event.preventDefault();
  };

  editor.addEventListener('wheel', preventBrowserZoom, eventOptions);
  editor.addEventListener('gesturestart', preventGestureZoom, eventOptions);
  editor.addEventListener('gesturechange', preventGestureZoom, eventOptions);
  editor.addEventListener('gestureend', preventGestureZoom, eventOptions);
}

function getCommonExtensions(
  editor: TestAffineEditorContainer
): ExtensionType[] {
  return [
    FontConfigExtension(CommunityCanvasTextFonts),
    EditorSettingExtension({
      setting$: mockEditorSetting(),
    }),
    {
      setup: di => {
        di.override(DocModeProvider, mockDocModeService(editor));
      },
    },
  ];
}

export function createEditor(doc: Store, _workspace: Workspace) {
  const featureFlags = doc.get(FeatureFlagService);
  featureFlags.setFlag('enable_advanced_block_visibility', true);
  featureFlags.setFlag('enable_edgeless_scribbled_style', true);

  const editor = document.createElement(
    'affine-editor-container'
  ) as TestAffineEditorContainer;

  editor.autofocus = true;
  editor.doc = doc;

  const commonExtensions = getCommonExtensions(editor);
  const edgelessSpecs = whiteboardViewExtensionManager.get('edgeless');
  editor.pageSpecs = [...edgelessSpecs, ...commonExtensions];
  editor.edgelessSpecs = [...edgelessSpecs, ...commonExtensions];
  editor.mode = 'edgeless';

  return editor;
}

export async function configureEditor(editor: TestAffineEditorContainer) {
  await editor.updateComplete;

  installEditorZoomGuards(editor);

  const editPropsStore = editor.std.get(EditPropsStore);
  const themeService = editor.std.get(ThemeProvider);
  const defaultShapeProps = {
    shapeStyle: ShapeStyle.Scribbled,
    filled: false,
    fillColor: DefaultTheme.transparent,
    fontFamily: FontFamily.Kalam,
  };

  const applyShapeDefaults = (scheme: ColorScheme) => {
    const strokeColor =
      scheme === ColorScheme.Dark
        ? DefaultTheme.white
        : DefaultTheme.black;

    editPropsStore.recordLastProps('shape:rect', {
      ...defaultShapeProps,
      strokeColor,
    });
    editPropsStore.recordLastProps('shape:ellipse', {
      ...defaultShapeProps,
      strokeColor,
    });
    editPropsStore.recordLastProps('shape:diamond', {
      ...defaultShapeProps,
      strokeColor,
    });
    editPropsStore.recordLastProps('shape:triangle', {
      ...defaultShapeProps,
      strokeColor,
    });
    editPropsStore.recordLastProps('shape:roundedRect', {
      ...defaultShapeProps,
      strokeColor,
      radius: 0.1,
    });
  };

  applyShapeDefaults(themeService.edgeless$.value);
  themeService.edgeless$.subscribe(value => {
    applyShapeDefaults(value);
  });
}

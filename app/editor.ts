import {
  ColorScheme,
  DefaultTheme,
  FontFamily,
  ShapeStyle,
} from '@linvo-core/content';
import {
  CommunityCanvasTextFonts,
  DocModeProvider,
  EditPropsStore,
  EditorSettingExtension,
  FeatureFlagService,
  FontConfigExtension,
  type ThemeService,
  ThemeProvider,
} from '@linvo-core/shared/services';
import type { ExtensionType, Store } from '@linvo-core/store';

import type { LinvoEditorContainerElement } from './editor-element';
import { whiteboardViewExtensionManager } from './extensions';
import {
  mockWhiteboardModeService,
  mockEditorSetting,
} from './mock-services';

type LinvoEditorContainer = LinvoEditorContainerElement;

function installEditorZoomGuards(editor: LinvoEditorContainer) {
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
  editor: LinvoEditorContainer
): ExtensionType[] {
  return [
    FontConfigExtension(CommunityCanvasTextFonts),
    EditorSettingExtension({
      setting$: mockEditorSetting(),
    }),
    {
      setup: di => {
        di.override(DocModeProvider, mockWhiteboardModeService(editor));
      },
    },
  ];
}

export function createEditor(whiteboardStore: Store) {
  const featureFlags = whiteboardStore.get(FeatureFlagService);
  featureFlags.setFlag('enable_advanced_block_visibility', true);
  featureFlags.setFlag('enable_edgeless_scribbled_style', true);

  const editor = document.createElement(
    'linvo-editor-container'
  ) as unknown as LinvoEditorContainer;

  editor.autofocus = true;
  editor.doc = whiteboardStore;

  const commonExtensions = getCommonExtensions(editor);
  const edgelessSpecs = whiteboardViewExtensionManager.get('edgeless');
  editor.pageSpecs = [...edgelessSpecs, ...commonExtensions];
  editor.edgelessSpecs = [...edgelessSpecs, ...commonExtensions];
  editor.mode = 'edgeless';

  return editor;
}

export async function configureEditor(editor: LinvoEditorContainer) {
  await editor.updateComplete;

  installEditorZoomGuards(editor);

  const editPropsStore = editor.std.get(EditPropsStore) as EditPropsStore;
  const themeService = editor.std.get(ThemeProvider) as ThemeService;
  const defaultShapeProps = {
    shapeStyle: ShapeStyle.Scribbled,
    filled: false,
    fillColor: DefaultTheme.transparent,
    fontFamily: FontFamily.Kalam,
  };
  const defaultShapeNames = [
    'rect',
    'ellipse',
    'diamond',
    'triangle',
    'hexagon',
    'pentagon',
    'octagon',
    'parallelogram',
    'leanLeft',
    'trapezoid',
    'trapezoidAlt',
    'stadium',
    'subroutine',
    'cylinder',
    'horizontalCylinder',
    'linedCylinder',
    'document',
    'linedDocument',
    'multiDocument',
    'note',
    'package',
    'cloud',
    'doubleCircle',
    'filledCircle',
    'asymmetric',
    'hourglass',
    'notchedRect',
    'notchedPentagon',
    'bolt',
    'bang',
    'flag',
    'bowRect',
    'smallCircle',
    'framedCircle',
    'crossedCircle',
    'taggedDocument',
    'taggedRect',
    'braceLeft',
    'braceRight',
    'braces',
    'delay',
    'curvedTrapezoid',
    'dividedRect',
    'forkJoin',
    'windowPane',
    'linedRect',
    'flippedTriangle',
    'slopedRect',
    'stackedRect',
    'odd',
  ] as const;

  const applyShapeDefaults = (scheme: ColorScheme) => {
    const strokeColor =
      scheme === ColorScheme.Dark
        ? DefaultTheme.white
        : DefaultTheme.black;

    for (const shapeName of defaultShapeNames) {
      editPropsStore.recordLastProps(`shape:${shapeName}`, {
        ...defaultShapeProps,
        strokeColor,
      });
    }

    editPropsStore.recordLastProps('shape:roundedRect', {
      ...defaultShapeProps,
      strokeColor,
      radius: 0.1,
    });
  };

  applyShapeDefaults(themeService.edgeless$.value);
  themeService.edgeless$.subscribe((value: ColorScheme) => {
    applyShapeDefaults(value);
  });
}

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

  const editPropsStore = editor.std.get(EditPropsStore);
  const themeService = editor.std.get(ThemeProvider);
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
  themeService.edgeless$.subscribe(value => {
    applyShapeDefaults(value);
  });
}

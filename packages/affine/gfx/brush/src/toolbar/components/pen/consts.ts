import {
  ExcalidrawHighlighterIcon,
  ExcalidrawPenIcon,
} from '@blocksuite/affine-widget-edgeless-toolbar';
import type { Pen } from './types';

export const penIconMap = {
  dark: {
    brush: ExcalidrawPenIcon(),
    highlighter: ExcalidrawHighlighterIcon(),
  },
  light: {
    brush: ExcalidrawPenIcon(),
    highlighter: ExcalidrawHighlighterIcon(),
  },
};

export const penInfoMap: { [k in Pen]: { tip: string; shortcut: string } } = {
  brush: {
    tip: 'Pen',
    shortcut: 'P',
  },
  highlighter: {
    tip: 'Highlighter',
    shortcut: '⇧ P',
  },
};

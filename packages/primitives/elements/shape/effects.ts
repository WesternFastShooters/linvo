import { defineCustomElement } from '@linvo-core/global/utils';
import { EdgelessShapeMorePanel } from './components/shape-more-panel';
import { EdgelessShapePanel } from './components/shape-panel';
import { EdgelessShapeStylePanel } from './components/shape-style-panel';
import {
  EdgelessShapeMenu,
  EdgelessShapeToolButton,
  EdgelessShapeToolElement,
  EdgelessToolbarShapeDraggable,
} from './draggable';
import { EdgelessShapeTextEditor } from './text/edgeless-shape-text-editor';

export function effects() {
  defineCustomElement('edgeless-shape-text-editor', EdgelessShapeTextEditor);
  defineCustomElement('edgeless-shape-menu', EdgelessShapeMenu);
  defineCustomElement(
    'edgeless-shape-tool-element',
    EdgelessShapeToolElement
  );
  defineCustomElement('edgeless-shape-tool-button', EdgelessShapeToolButton);
  defineCustomElement(
    'edgeless-toolbar-shape-draggable',
    EdgelessToolbarShapeDraggable
  );
  defineCustomElement('edgeless-shape-panel', EdgelessShapePanel);
  defineCustomElement('edgeless-shape-more-panel', EdgelessShapeMorePanel);
  defineCustomElement('edgeless-shape-style-panel', EdgelessShapeStylePanel);
}

declare global {
  interface HTMLElementTagNameMap {
    'edgeless-shape-text-editor': EdgelessShapeTextEditor;
    'edgeless-shape-menu': EdgelessShapeMenu;
    'edgeless-shape-tool-element': EdgelessShapeToolElement;
    'edgeless-toolbar-shape-draggable': EdgelessToolbarShapeDraggable;
    'edgeless-shape-tool-button': EdgelessShapeToolButton;
    'edgeless-shape-panel': EdgelessShapePanel;
    'edgeless-shape-more-panel': EdgelessShapeMorePanel;
    'edgeless-shape-style-panel': EdgelessShapeStylePanel;
  }
}

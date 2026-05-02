import { defineCustomElement } from '@linvo-core/global/utils';
import { MindMapPlaceholder } from './toolbar/mindmap-importing-placeholder';
import { EdgelessMindmapMenu } from './toolbar/mindmap-menu';
import { EdgelessMindmapToolButton } from './toolbar/mindmap-tool-button';

export function effects() {
  defineCustomElement(
    'edgeless-mindmap-tool-button',
    EdgelessMindmapToolButton
  );
  defineCustomElement('edgeless-mindmap-menu', EdgelessMindmapMenu);
  defineCustomElement('mindmap-import-placeholder', MindMapPlaceholder);
}

declare global {
  interface HTMLElementTagNameMap {
    'edgeless-mindmap-tool-button': EdgelessMindmapToolButton;
    'edgeless-mindmap-menu': EdgelessMindmapMenu;
    'mindmap-import-placeholder': MindMapPlaceholder;
  }
}

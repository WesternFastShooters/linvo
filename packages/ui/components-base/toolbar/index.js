import { defineCustomElement } from '@linvo-core/global/utils';
import { EditorIconButton } from './icon-button';
import { EditorMenuAction, EditorMenuButton, EditorMenuContent, } from './menu-button';
import { EditorToolbarSeparator } from './separator';
import { EditorToolbar } from './toolbar';
import { Tooltip } from './tooltip';
export { EditorChevronDown } from './chevron-down';
export { ToolbarMoreMenuConfigExtension } from './config';
export { EditorIconButton } from './icon-button';
export { EditorMenuAction, EditorMenuButton, EditorMenuContent, } from './menu-button';
export { MenuContext } from './menu-context';
export { EditorToolbarSeparator } from './separator';
export { darkToolbarStyles, lightToolbarStyles } from './styles';
export { EditorToolbar } from './toolbar';
export { Tooltip } from './tooltip';
export { cloneGroups, getMoreMenuConfig, groupsToActions, renderActions, renderGroups, renderToolbarSeparator, } from './utils';
export function effects() {
    defineCustomElement('editor-toolbar-separator', EditorToolbarSeparator);
    defineCustomElement('editor-toolbar', EditorToolbar);
    defineCustomElement('editor-icon-button', EditorIconButton);
    defineCustomElement('editor-menu-button', EditorMenuButton);
    defineCustomElement('editor-menu-content', EditorMenuContent);
    defineCustomElement('editor-menu-action', EditorMenuAction);
    defineCustomElement('linvo-tooltip', Tooltip);
}

import { CodeBlockComponent } from './code-block';
import {
  LINVO_CODE_TOOLBAR_WIDGET,
  LinvoCodeToolbarWidget,
} from './code-toolbar';
import { LinvoCodeToolbar } from './code-toolbar/components/code-toolbar';
import { LanguageListButton } from './code-toolbar/components/lang-button';
import { PreviewButton } from './code-toolbar/components/preview-button';
import { LinvoCodeUnit } from './highlight/linvo-code-unit';

export function effects() {
  customElements.define('language-list-button', LanguageListButton);
  customElements.define('linvo-code-toolbar', LinvoCodeToolbar);
  customElements.define(LINVO_CODE_TOOLBAR_WIDGET, LinvoCodeToolbarWidget);
  customElements.define('linvo-code-unit', LinvoCodeUnit);
  customElements.define('linvo-code', CodeBlockComponent);
  customElements.define('preview-button', PreviewButton);
}

declare global {
  interface HTMLElementTagNameMap {
    'language-list-button': LanguageListButton;
    'linvo-code-toolbar': LinvoCodeToolbar;
    'preview-button': PreviewButton;
    [LINVO_CODE_TOOLBAR_WIDGET]: LinvoCodeToolbarWidget;
  }
}

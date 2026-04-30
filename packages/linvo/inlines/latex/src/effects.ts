import { LatexEditorMenu } from './latex-node/latex-editor-menu';
import { LatexEditorUnit } from './latex-node/latex-editor-unit';
import { LinvoLatexNode } from './latex-node/latex-node';

export function effects() {
  customElements.define('latex-editor-menu', LatexEditorMenu);
  customElements.define('latex-editor-unit', LatexEditorUnit);
  customElements.define('linvo-latex-node', LinvoLatexNode);
}

declare global {
  interface HTMLElementTagNameMap {
    'linvo-latex-node': LinvoLatexNode;
    'latex-editor-unit': LatexEditorUnit;
    'latex-editor-menu': LatexEditorMenu;
  }
}

import {
  type ViewExtensionContext,
  ViewExtensionProvider,
} from '@blocksuite/affine/ext-loader';

import { MermaidInsertModal } from './modal';
import { MermaidPlacementTool } from './placement-tool';
import { EdgelessMermaidButton, mermaidSeniorTool } from './toolbar';

function define(name: string, ctor: CustomElementConstructor) {
  if (!customElements.get(name)) {
    customElements.define(name, ctor);
  }
}

export class MermaidViewExtension extends ViewExtensionProvider {
  override name = 'best-excalidraw-mermaid';

  override effect(): void {
    super.effect();
    define('edgeless-mermaid-button', EdgelessMermaidButton);
    define('mermaid-insert-modal', MermaidInsertModal);
  }

  override setup(context: ViewExtensionContext) {
    super.setup(context);
    if (!this.isEdgeless(context.scope)) return;
    context.register(mermaidSeniorTool);
    context.register(MermaidPlacementTool);
  }
}

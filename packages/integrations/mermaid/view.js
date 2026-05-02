import { ViewExtensionProvider, } from '@linvo-core/composition';
import { MermaidInsertModal } from './modal';
import { MermaidPlacementTool } from './placement-tool';
import { EdgelessMermaidButton, mermaidSeniorTool } from './toolbar';
function define(name, ctor) {
    if (!customElements.get(name)) {
        customElements.define(name, ctor);
    }
}
export class MermaidViewExtension extends ViewExtensionProvider {
    constructor() {
        super(...arguments);
        this.name = 'linvo-mermaid';
    }
    effect() {
        super.effect();
        define('edgeless-mermaid-button', EdgelessMermaidButton);
        define('mermaid-insert-modal', MermaidInsertModal);
    }
    setup(context) {
        super.setup(context);
        if (!this.isEdgeless(context.scope))
            return;
        context.register(mermaidSeniorTool);
        context.register(MermaidPlacementTool);
    }
}

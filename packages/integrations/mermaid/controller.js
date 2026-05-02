import { computed, signal } from '@preact/signals-core';
import { buildMermaidInsertPlan } from './plan';
import { MermaidInsertModal } from './modal';
import { MermaidPlacementTool } from './placement-tool';
import { buildMermaidPreviewModel } from './preview';
import { renderMermaid } from './runtime';
const DEFAULT_MERMAID = `flowchart LR
  Start([Start]) --> Decide{Ready?}
  Decide -->|Yes| Done((Done))
  Decide -->|No| Task[Do work]
  Task --> Decide`;
export class MermaidInsertController {
    constructor() {
        this.state = {
            open: signal(false),
            code: signal(DEFAULT_MERMAID),
            rendering: signal(false),
            error: signal(null),
            renderResult: signal(null),
            plan: signal(null),
            preview: signal(null),
        };
        this.canInsert = computed(() => this.state.open.value &&
            !this.state.rendering.value &&
            !this.state.error.value &&
            !!this.state.renderResult.value &&
            !!this.state.plan.value);
        this.currentEdgeless = null;
        this.modal = null;
        this.renderToken = 0;
        queueMicrotask(() => {
            void this.renderCurrentCode();
        });
    }
    attach(edgeless) {
        this.currentEdgeless = edgeless;
        this.ensureModal();
    }
    close() {
        this.state.open.value = false;
    }
    open(edgeless) {
        this.attach(edgeless);
        this.state.open.value = true;
        this.modal?.requestUpdate();
        if (!this.state.renderResult.value && !this.state.rendering.value) {
            void this.renderCurrentCode();
        }
    }
    async renderCurrentCode() {
        const token = ++this.renderToken;
        this.state.rendering.value = true;
        this.state.error.value = null;
        try {
            const renderResult = await renderMermaid(this.state.code.value);
            if (token !== this.renderToken)
                return;
            this.state.renderResult.value = renderResult;
            const plan = buildMermaidInsertPlan(renderResult);
            this.state.plan.value = plan;
            this.state.preview.value = buildMermaidPreviewModel(plan, renderResult.svg);
        }
        catch (error) {
            if (token !== this.renderToken)
                return;
            const message = error instanceof Error ? error.message : 'Failed to render Mermaid.';
            this.state.renderResult.value = null;
            this.state.plan.value = null;
            this.state.preview.value = null;
            this.state.error.value = message;
        }
        finally {
            if (token === this.renderToken) {
                this.state.rendering.value = false;
            }
        }
    }
    startPlacement() {
        if (!this.currentEdgeless || !this.canInsert.value) {
            return;
        }
        const renderResult = this.state.renderResult.value;
        const plan = this.state.plan.value;
        const preview = this.state.preview.value;
        if (!renderResult || !plan || !preview)
            return;
        const options = {
            controller: this,
            plan,
            renderResult,
            overlaySvg: preview.svg,
            overlayWidth: preview.width,
            overlayHeight: preview.height,
        };
        this.state.open.value = false;
        this.currentEdgeless.gfx.tool.setTool(MermaidPlacementTool, options);
    }
    updateCode(code) {
        this.state.code.value = code;
        void this.renderCurrentCode();
    }
    ensureModal() {
        if (this.modal)
            return;
        this.modal = document.createElement('mermaid-insert-modal');
        this.modal.controller = this;
        document.body.append(this.modal);
    }
    snapshot() {
        return {
            open: this.state.open.value,
            code: this.state.code.value,
            rendering: this.state.rendering.value,
            error: this.state.error.value,
            renderResult: this.state.renderResult.value,
            plan: this.state.plan.value,
            preview: this.state.preview.value,
        };
    }
}
const controllers = new WeakMap();
export function getMermaidInsertController(edgeless) {
    const host = edgeless.std.host;
    let controller = controllers.get(host);
    if (!controller) {
        controller = new MermaidInsertController();
        controllers.set(host, controller);
    }
    controller.attach(edgeless);
    return controller;
}

import type { EdgelessRootBlockComponent } from '@linvo/linvo/blocks/root';
import type { ToolOptions } from '@linvo/std/gfx';
import { computed, signal } from '@preact/signals-core';

import { buildMermaidInsertPlan } from './plan';
import { MermaidInsertModal } from './modal';
import { MermaidPlacementTool } from './placement-tool';
import { buildMermaidPreviewModel } from './preview';
import { renderMermaid } from './runtime';
import type {
  MermaidInsertPlan,
  MermaidPreviewModel,
  MermaidRenderResult,
} from './types';

const DEFAULT_MERMAID = `flowchart LR
  Start([Start]) --> Decide{Ready?}
  Decide -->|Yes| Done((Done))
  Decide -->|No| Task[Do work]
  Task --> Decide`;

type MermaidState = {
  open: boolean;
  code: string;
  rendering: boolean;
  error: string | null;
  renderResult: MermaidRenderResult | null;
  plan: MermaidInsertPlan | null;
  preview: MermaidPreviewModel | null;
};

export class MermaidInsertController {
  readonly state = {
    open: signal(false),
    code: signal(DEFAULT_MERMAID),
    rendering: signal(false),
    error: signal<string | null>(null),
    renderResult: signal<MermaidRenderResult | null>(null),
    plan: signal<MermaidInsertPlan | null>(null),
    preview: signal<MermaidPreviewModel | null>(null),
  };

  readonly canInsert = computed(
    () =>
      this.state.open.value &&
      !this.state.rendering.value &&
      !this.state.error.value &&
      !!this.state.renderResult.value &&
      !!this.state.plan.value
  );

  private currentEdgeless: EdgelessRootBlockComponent | null = null;
  private modal: MermaidInsertModal | null = null;
  private renderToken = 0;

  constructor() {
    queueMicrotask(() => {
      void this.renderCurrentCode();
    });
  }

  attach(edgeless: EdgelessRootBlockComponent) {
    this.currentEdgeless = edgeless;
    this.ensureModal();
  }

  close() {
    this.state.open.value = false;
  }

  open(edgeless: EdgelessRootBlockComponent) {
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
      if (token !== this.renderToken) return;
      this.state.renderResult.value = renderResult;
      const plan = buildMermaidInsertPlan(renderResult);
      this.state.plan.value = plan;
      this.state.preview.value = buildMermaidPreviewModel(plan, renderResult.svg);
    } catch (error) {
      if (token !== this.renderToken) return;
      const message =
        error instanceof Error ? error.message : 'Failed to render Mermaid.';
      this.state.renderResult.value = null;
      this.state.plan.value = null;
      this.state.preview.value = null;
      this.state.error.value = message;
    } finally {
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
    if (!renderResult || !plan || !preview) return;

    const options: ToolOptions<MermaidPlacementTool> = {
      controller: this,
      plan,
      renderResult,
      overlaySvg: preview.svg,
      overlayWidth: preview.width,
      overlayHeight: preview.height,
    } as ToolOptions<MermaidPlacementTool>;

    this.state.open.value = false;
    this.currentEdgeless.gfx.tool.setTool(MermaidPlacementTool, options);
  }

  updateCode(code: string) {
    this.state.code.value = code;
    void this.renderCurrentCode();
  }

  private ensureModal() {
    if (this.modal) return;
    this.modal = document.createElement(
      'mermaid-insert-modal'
    ) as MermaidInsertModal;
    this.modal.controller = this;
    document.body.append(this.modal);
  }

  snapshot(): MermaidState {
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

const controllers = new WeakMap<EventTarget, MermaidInsertController>();

export function getMermaidInsertController(
  edgeless: EdgelessRootBlockComponent
) {
  const host = edgeless.std.host;
  let controller = controllers.get(host);
  if (!controller) {
    controller = new MermaidInsertController();
    controllers.set(host, controller);
  }
  controller.attach(edgeless);
  return controller;
}

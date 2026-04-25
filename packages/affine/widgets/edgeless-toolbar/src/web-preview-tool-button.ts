import { DefaultTool, EdgelessCRUDIdentifier } from '@blocksuite/affine-block-surface';
import { createLitPortal } from '@blocksuite/affine-components/portal';
import { SignalWatcher } from '@blocksuite/global/lit';
import type { Bound } from '@blocksuite/global/gfx';
import { css, html, LitElement } from 'lit';
import { property, query } from 'lit/decorators.js';

import { ExcalidrawWebPreviewIcon } from './button/excalidraw-topbar-icons';
import {
  EdgelessDraggableElementController,
  type ElementInfo,
} from './draggable';
import { EdgelessToolbarToolMixin } from './mixins';
import {
  EdgelessWebPreviewUrlModal,
  type WebPreviewSubmitPayload,
} from './web-preview-url-modal';

const WEB_PREVIEW_WIDTH = 1200;
const WEB_PREVIEW_HEIGHT = 720;
const GHOST_PREVIEW_SIZE = 200;

const createGhostPreviewCard = (url: string) => {
  const host = new URL(url).host;

  return html`
    <div
      style="
        box-sizing: border-box;
        width: 200px;
        height: 200px;
        display: flex;
        flex-direction: column;
        border-radius: 16px;
        overflow: hidden;
        background: white;
        border: 1px solid rgba(15, 23, 42, 0.08);
        box-shadow:
          0 24px 48px rgba(15, 23, 42, 0.18),
          0 8px 18px rgba(15, 23, 42, 0.1);
        color: #111827;
        user-select: none;
      "
    >
      <div
        style="
          height: 76px;
          background:
            radial-gradient(circle at top left, rgba(37, 99, 235, 0.14), transparent 52%),
            linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%);
          border-bottom: 1px solid rgba(15, 23, 42, 0.06);
          position: relative;
        "
      >
        <div
          style="
            position: absolute;
            inset: 14px;
            border-radius: 10px;
            border: 1px solid rgba(37, 99, 235, 0.16);
            background: rgba(255, 255, 255, 0.72);
            display: flex;
            align-items: center;
            padding: 0 10px;
            gap: 8px;
          "
        >
          <span style="display:flex; gap:5px;">
            <span style="width:8px; height:8px; border-radius:999px; background:#f87171;"></span>
            <span style="width:8px; height:8px; border-radius:999px; background:#fbbf24;"></span>
            <span style="width:8px; height:8px; border-radius:999px; background:#34d399;"></span>
          </span>
          <span
            style="
              flex: 1;
              font-size: 11px;
              line-height: 16px;
              color: #64748b;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            "
          >
            ${host}
          </span>
        </div>
      </div>
      <div
        style="
          flex: 1;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        "
      >
        <div
          style="
            display: flex;
            align-items: center;
            gap: 8px;
            color: #0f172a;
          "
        >
          <span style="display:flex; width:18px; height:18px;">
            ${ExcalidrawWebPreviewIcon()}
          </span>
          <span
            style="
              font-size: 15px;
              line-height: 22px;
              font-weight: 600;
            "
          >
            Web Preview
          </span>
        </div>
        <div
          style="
            font-size: 12px;
            line-height: 18px;
            color: #475569;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          "
        >
          ${url}
        </div>
      </div>
    </div>
  `;
};

type CreatedEmbedBlockComponent = HTMLElement & {
  updateComplete?: Promise<unknown>;
};

type EdgelessRootLike = {
  surfaceBlockModel: {
    id: string;
  };
};

type WebPreviewDragInfo = {
  type: 'web-preview';
  url: string;
};

export class EdgelessWebPreviewToolButton extends EdgelessToolbarToolMixin(
  SignalWatcher(LitElement)
) {
  static override styles = css`
    :host {
      display: flex;
    }
  `;

  draggableController!: EdgelessDraggableElementController<WebPreviewDragInfo>;

  private _modalAbortController: AbortController | null = null;
  private _pendingDragInfo: ElementInfo<WebPreviewDragInfo> | null = null;

  override type = DefaultTool;

  get crud() {
    return this.edgeless.std.get(EdgelessCRUDIdentifier);
  }

  private get _surfaceId() {
    return (this.edgeless as unknown as EdgelessRootLike).surfaceBlockModel.id;
  }

  private readonly _openModal = () => {
    if (this._modalAbortController) {
      this._modalAbortController.abort();
    }

    this._modalAbortController = new AbortController();

    createLitPortal({
      template: html`
        <edgeless-web-preview-url-modal
          .abortController=${this._modalAbortController}
          .onSubmit=${(payload: WebPreviewSubmitPayload) => {
            this._prepareDrag(payload);
          }}
        ></edgeless-web-preview-url-modal>
      `,
      container: document.body,
      abortController: this._modalAbortController,
      closeOnClickAway: false,
    });
  };

  private readonly _prepareDrag = (payload: WebPreviewSubmitPayload) => {
    this._pendingDragInfo = {
      data: {
        type: 'web-preview',
        url: payload.url,
      },
      preview: createGhostPreviewCard(payload.url),
      standardWidth: GHOST_PREVIEW_SIZE,
    };

    if (!this.draggableController || !this.buttonElement) {
      return;
    }

    this.draggableController.clickToDrag(this.buttonElement, {
      x: payload.clientX,
      y: payload.clientY,
    });
  };

  private async _focusCreatedBlock(blockId: string) {
    this.gfx.selection.set({
      elements: [blockId],
      editing: false,
    });

    await this.edgeless.std.host.updateComplete;
    const block = this.edgeless.std.view.getBlock(
      blockId
    ) as CreatedEmbedBlockComponent | null;
    await block?.updateComplete?.catch(console.error);
  }

  private readonly _createWebPreviewBlock = async (
    bound: Bound,
    url: string
  ) => {
    const title = new URL(url).host;
    const blockId = this.crud.addBlock(
      'affine:embed-iframe',
      {
        url,
        iframeUrl: url,
        title,
        description: '',
        xywh: bound.serialize(),
      },
      this._surfaceId
    );
    if (!blockId) {
      return;
    }

    this.gfx.tool.setTool(DefaultTool);
    await this._focusCreatedBlock(blockId);
  };

  initDragController() {
    if (!this.edgeless || !this.toolbarContainer || this.draggableController) {
      return;
    }

    this.draggableController = new EdgelessDraggableElementController(this, {
      edgeless: this.edgeless,
      scopeElement: this.toolbarContainer,
      standardWidth: GHOST_PREVIEW_SIZE,
      clickToDrag: true,
      onDrop: (element, bound) => {
        this._createWebPreviewBlock(
          bound,
          element.data.url
        ).catch(console.error);
        this._pendingDragInfo = null;
      },
      onCanceled: overlay => {
        overlay.transitionWrapper.style.transformOrigin = 'unset';
        this._pendingDragInfo = null;
      },
    });
  }

  override updated(changedProperties: Map<PropertyKey, unknown>) {
    super.updated(changedProperties);

    const controllerRequiredProps = ['edgeless', 'toolbarContainer'] as const;
    if (
      controllerRequiredProps.some(property => changedProperties.has(property))
    ) {
      this.initDragController();
    }
  }

  override render() {
    const dragging = !!this.draggableController?.states.draggingElement;

    return html`
      <edgeless-tool-icon-button
        .tooltip=${'Web Preview'}
        .tipPosition=${'bottom'}
        .tooltipOffset=${10}
        .active=${dragging}
        .activeMode=${'background'}
        .iconContainerPadding=${[8, 10]}
        .iconSize=${'20px'}
        @mousedown=${(event: MouseEvent) => {
          if (!this.draggableController || !this._pendingDragInfo) return;
          this.draggableController.onMouseDown(event, this._pendingDragInfo);
        }}
        @touchstart=${(event: TouchEvent) => {
          if (!this.draggableController || !this._pendingDragInfo) return;
          this.draggableController.onTouchStart(event, this._pendingDragInfo);
        }}
        @click=${() => {
          if (this._pendingDragInfo) {
            return;
          }
          this._openModal();
        }}
      >
        ${ExcalidrawWebPreviewIcon()}
      </edgeless-tool-icon-button>
    `;
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._modalAbortController?.abort();
    this._modalAbortController = null;
  }

  @query('edgeless-tool-icon-button')
  accessor buttonElement!: HTMLElement;

  @property({ attribute: false })
  accessor toolbarContainer: HTMLElement | null = null;
}

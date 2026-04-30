import { DefaultTool, EdgelessCRUDIdentifier } from '@linvo/linvo-block-surface';
import { createLitPortal } from '@linvo/linvo-components/portal';
import { SignalWatcher } from '@linvo/global/lit';
import type { Bound } from '@linvo/global/gfx';
import { css, html, LitElement } from 'lit';
import { query } from 'lit/decorators.js';

import { ExcalidrawWebPreviewIcon } from './button/excalidraw-topbar-icons';
import {
  EdgelessDraggableElementController,
  type ElementInfo,
} from './draggable';
import { EdgelessToolbarToolMixin } from './mixins';
import {
  type WebPreviewSubmitPayload,
} from './web-preview-url-modal';

const GHOST_PREVIEW_WIDTH = 280;
const GHOST_PREVIEW_HEIGHT = 180;

const createGhostPreviewCard = (_url: string) => {
  return html`
    <svg
      width="${GHOST_PREVIEW_WIDTH}"
      height="${GHOST_PREVIEW_HEIGHT}"
      viewBox="0 0 280 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter
          id="ghost-shadow"
          x="-20"
          y="-10"
          width="320"
          height="220"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="12" />
          <feGaussianBlur stdDeviation="12" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow"
            result="shape"
          />
        </filter>
      </defs>

      <g filter="url(#ghost-shadow)" opacity="0.8">
        <rect
          x="2"
          y="2"
          width="276"
          height="176"
          rx="8"
          fill="white"
          fill-opacity="0.8"
        />
        <rect
          x="2"
          y="2"
          width="276"
          height="176"
          rx="8"
          stroke="#1890FF"
          stroke-width="2"
        />

        <g transform="translate(14, 14)">
          <rect width="200" height="10" rx="2" fill="#F0F0F0" />
          <rect y="18" width="150" height="10" rx="2" fill="#F0F0F0" />
          <rect y="36" width="252" height="116" rx="4" fill="#F9F9F9" />
          <text
            x="126"
            y="105"
            text-anchor="middle"
            font-family="Arial"
            font-size="24"
            fill="#000"
            fill-opacity="0.2"
          >
            🔗
          </text>
        </g>
      </g>
    </svg>
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
      standardWidth: GHOST_PREVIEW_WIDTH,
      standardHeight: GHOST_PREVIEW_HEIGHT,
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

  private readonly _createWebPreviewBlock = async (bound: Bound, url: string) => {
    const title = new URL(url).host;
    const blockId = this.crud.addBlock(
      'linvo:embed-iframe',
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
      standardWidth: GHOST_PREVIEW_WIDTH,
      standardHeight: GHOST_PREVIEW_HEIGHT,
      clickToDrag: true,
      scaleDragPreviewWithZoom: false,
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
}

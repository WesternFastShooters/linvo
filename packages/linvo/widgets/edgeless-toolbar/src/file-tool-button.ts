import { addAttachments } from '@linvo/linvo-block-attachment';
import { DefaultTool } from '@linvo/linvo-block-surface';
import { EMBED_CARD_HEIGHT, EMBED_CARD_WIDTH } from '@linvo/linvo-shared/consts';
import { TelemetryProvider } from '@linvo/linvo-shared/services';
import { openSingleFileWith } from '@linvo/linvo-shared/utils';
import { AttachmentIcon } from '@icons/lit';
import { SignalWatcher } from '@linvo/global/lit';
import type { Bound } from '@linvo/global/gfx';
import { css, html, LitElement } from 'lit';
import { query } from 'lit/decorators.js';

import {
  EdgelessDraggableElementController,
  type ElementInfo,
} from './draggable';
import { EdgelessToolbarToolMixin } from './mixins';

const GHOST_PREVIEW_WIDTH = EMBED_CARD_WIDTH.cubeThick;
const GHOST_PREVIEW_HEIGHT = EMBED_CARD_HEIGHT.cubeThick;

const createGhostPreviewCard = (file: File) => {
  const fileName =
    file.name.length > 18 ? `${file.name.slice(0, 15)}...` : file.name;
  const extension = file.name.split('.').pop()?.slice(0, 4).toUpperCase() || 'FILE';

  return html`
    <svg
      width="${GHOST_PREVIEW_WIDTH}"
      height="${GHOST_PREVIEW_HEIGHT}"
      viewBox="0 0 ${GHOST_PREVIEW_WIDTH} ${GHOST_PREVIEW_HEIGHT}"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter
          id="ghost-file-shadow"
          x="-24"
          y="-16"
          width="218"
          height="180"
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
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.18 0"
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

      <g filter="url(#ghost-file-shadow)" opacity="0.84">
        <rect
          x="2"
          y="2"
          width="${GHOST_PREVIEW_WIDTH - 4}"
          height="${GHOST_PREVIEW_HEIGHT - 4}"
          rx="18"
          fill="white"
        />
        <rect
          x="2"
          y="2"
          width="${GHOST_PREVIEW_WIDTH - 4}"
          height="${GHOST_PREVIEW_HEIGHT - 4}"
          rx="18"
          stroke="#1890FF"
          stroke-width="2"
        />

        <rect x="18" y="18" width="56" height="56" rx="14" fill="#E8F3FF" />
        <g transform="translate(30, 30) scale(1.2)">
          ${AttachmentIcon()}
        </g>

        <rect x="90" y="24" width="58" height="22" rx="11" fill="#EEF6FF" />
        <text
          x="119"
          y="39"
          text-anchor="middle"
          font-family="Arial"
          font-size="11"
          font-weight="700"
          fill="#1677FF"
        >
          ${extension}
        </text>

        <text
          x="18"
          y="98"
          font-family="Arial"
          font-size="15"
          font-weight="700"
          fill="#1F1F1F"
        >
          ${fileName}
        </text>
        <text
          x="18"
          y="118"
          font-family="Arial"
          font-size="12"
          fill="#8C8C8C"
        >
          Click on canvas to place
        </text>
      </g>
    </svg>
  `;
};

type FileDragInfo = {
  type: 'attachment';
  file: File;
};

export class EdgelessFileToolButton extends EdgelessToolbarToolMixin(
  SignalWatcher(LitElement)
) {
  static override styles = css`
    :host {
      display: flex;
    }
  `;

  draggableController!: EdgelessDraggableElementController<FileDragInfo>;

  private _pendingDragInfo: ElementInfo<FileDragInfo> | null = null;

  override type = DefaultTool;

  private readonly _pickFile = async (event?: MouseEvent) => {
    const file = await openSingleFileWith();
    if (!file) return;

    this._pendingDragInfo = {
      data: {
        type: 'attachment',
        file,
      },
      preview: createGhostPreviewCard(file),
      standardWidth: GHOST_PREVIEW_WIDTH,
      standardHeight: GHOST_PREVIEW_HEIGHT,
    };

    if (!this.draggableController || !this.buttonElement) {
      return;
    }

    const buttonRect = this.buttonElement.getBoundingClientRect();
    this.draggableController.clickToDrag(this.buttonElement, {
      x: event?.clientX ?? buttonRect.left + buttonRect.width / 2,
      y: event?.clientY ?? buttonRect.top + buttonRect.height / 2,
    });
  };

  private readonly _createAttachmentBlock = async (bound: Bound, file: File) => {
    await addAttachments(
      this.edgeless.std,
      [file],
      [bound.x + bound.w / 2, bound.y + bound.h / 2],
      false
    );
    this.gfx.tool.setTool(DefaultTool);
    this.edgeless.std.getOptional(TelemetryProvider)?.track('CanvasElementAdded', {
      control: 'toolbar:general',
      page: 'whiteboard editor',
      module: 'toolbar',
      segment: 'toolbar',
      type: 'attachment',
    });
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
        this._createAttachmentBlock(bound, element.data.file).catch(console.error);
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
    const active =
      !!this.draggableController?.states.draggingElement || !!this._pendingDragInfo;

    return html`
      <edgeless-tool-icon-button
        .tooltip=${'File'}
        .tipPosition=${'bottom'}
        .tooltipOffset=${10}
        .active=${active}
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
        @click=${(event: MouseEvent) => {
          if (this._pendingDragInfo) {
            return;
          }
          this._pickFile(event).catch(console.error);
        }}
      >
        ${AttachmentIcon()}
      </edgeless-tool-icon-button>
    `;
  }

  @query('edgeless-tool-icon-button')
  accessor buttonElement!: HTMLElement;
}

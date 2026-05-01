import {
  getShapeType,
  shapeMethods,
  type ShapeName,
  ShapeStyle,
  ShapeType,
} from '@linvo/linvo-model';
import { WithDisposable } from '@linvo/global/lit';
import type { BlockComponent } from '@linvo/std';
import { svg } from 'lit';
import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import {
  PRESET_SHAPE_TYPES,
  pointsToSvgPath,
} from '../preset-shape-utils.js';
import { ShapeComponentConfig } from '../toolbar/shape-menu-config.js';

type ShapeOption = {
  name: ShapeName;
  label: string;
};

const BASIC_SHAPES: ShapeOption[] = [
  { name: ShapeType.Rect, label: 'Square' },
  { name: 'roundedRect', label: 'Rounded' },
  { name: ShapeType.Ellipse, label: 'Ellipse' },
  { name: ShapeType.Diamond, label: 'Diamond' },
  { name: ShapeType.Triangle, label: 'Triangle' },
];

const PRESET_SHAPE_LABELS: Record<(typeof PRESET_SHAPE_TYPES)[number], string> =
  {
    [ShapeType.Hexagon]: 'Hexagon',
    [ShapeType.Pentagon]: 'Pentagon',
    [ShapeType.Octagon]: 'Octagon',
    [ShapeType.Parallelogram]: 'Parallelogram',
    [ShapeType.LeanLeft]: 'Lean left',
    [ShapeType.Trapezoid]: 'Trapezoid',
    [ShapeType.TrapezoidAlt]: 'Trapezoid alt',
    [ShapeType.Stadium]: 'Stadium',
    [ShapeType.Subroutine]: 'Subroutine',
    [ShapeType.Cylinder]: 'Cylinder',
    [ShapeType.HorizontalCylinder]: 'Horizontal cylinder',
    [ShapeType.LinedCylinder]: 'Lined cylinder',
    [ShapeType.Document]: 'Document',
    [ShapeType.LinedDocument]: 'Lined document',
    [ShapeType.MultiDocument]: 'Multi document',
    [ShapeType.Note]: 'Note',
    [ShapeType.Package]: 'Package',
    [ShapeType.Cloud]: 'Cloud',
    [ShapeType.DoubleCircle]: 'Double circle',
    [ShapeType.FilledCircle]: 'Filled circle',
    [ShapeType.Asymmetric]: 'Asymmetric',
    [ShapeType.Hourglass]: 'Hourglass',
    [ShapeType.NotchedRect]: 'Notched rect',
    [ShapeType.NotchedPentagon]: 'Notched pentagon',
    [ShapeType.Bolt]: 'Bolt',
    [ShapeType.Bang]: 'Bang',
    [ShapeType.Flag]: 'Flag',
    [ShapeType.BowRect]: 'Bow rect',
    [ShapeType.SmallCircle]: 'Small circle',
    [ShapeType.FramedCircle]: 'Framed circle',
    [ShapeType.CrossedCircle]: 'Crossed circle',
    [ShapeType.TaggedDocument]: 'Tagged document',
    [ShapeType.TaggedRect]: 'Tagged rect',
    [ShapeType.BraceLeft]: 'Brace left',
    [ShapeType.BraceRight]: 'Brace right',
    [ShapeType.Braces]: 'Braces',
    [ShapeType.Delay]: 'Delay',
    [ShapeType.CurvedTrapezoid]: 'Curved trapezoid',
    [ShapeType.DividedRect]: 'Divided rect',
    [ShapeType.ForkJoin]: 'Fork join',
    [ShapeType.WindowPane]: 'Window pane',
    [ShapeType.LinedRect]: 'Lined rect',
    [ShapeType.FlippedTriangle]: 'Flipped triangle',
    [ShapeType.SlopedRect]: 'Sloped rect',
    [ShapeType.StackedRect]: 'Stacked rect',
    [ShapeType.Odd]: 'Odd',
  };

const PRESET_SHAPES: ShapeOption[] = PRESET_SHAPE_TYPES.map(name => ({
  name,
  label: PRESET_SHAPE_LABELS[name],
}));

function renderPresetShapeIcon(name: (typeof PRESET_SHAPE_TYPES)[number]) {
  const path = pointsToSvgPath(
    shapeMethods[getShapeType(name)].points({ x: 3, y: 4, w: 18, h: 14 }) as [
      number,
      number,
    ][]
  );
  const underlay =
    name === ShapeType.MultiDocument
      ? svg`
          <path
            d=${pointsToSvgPath(
              shapeMethods[ShapeType.Document].points({
                x: 1,
                y: 1,
                w: 18,
                h: 14,
              }) as [number, number][]
            )}
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linejoin="round"
            stroke-linecap="round"
            opacity="0.45"
          />
          <path
            d=${pointsToSvgPath(
              shapeMethods[ShapeType.Document].points({
                x: 2,
                y: 2.5,
                w: 18,
                h: 14,
              }) as [number, number][]
            )}
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linejoin="round"
            stroke-linecap="round"
            opacity="0.75"
          />
        `
      : name === ShapeType.StackedRect
        ? svg`
            <path
              d=${pointsToSvgPath(
                shapeMethods.rect.points({ x: 1, y: 1, w: 18, h: 14 }) as [
                  number,
                  number,
                ][]
              )}
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linejoin="round"
              stroke-linecap="round"
              opacity="0.45"
            />
            <path
              d=${pointsToSvgPath(
                shapeMethods.rect.points({ x: 2, y: 2.5, w: 18, h: 14 }) as [
                  number,
                  number,
                ][]
              )}
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linejoin="round"
              stroke-linecap="round"
              opacity="0.75"
            />
          `
        : null;

  return svg`<svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    ${underlay}
    <path
      d=${path}
      fill=${name === ShapeType.FilledCircle ? 'currentColor' : 'none'}
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linejoin="round"
      stroke-linecap="round"
    />
  </svg>`;
}

export class EdgelessShapeMorePanel extends WithDisposable(LitElement) {
  private _anchorResizeObserver: ResizeObserver | null = null;

  static override styles = css`
    :host {
      display: block;
      position: fixed;
      z-index: 1000;
      pointer-events: auto;
      left: var(--shape-more-panel-left, 0px);
      top: var(--shape-more-panel-top, 0px);
      width: var(--shape-more-panel-width, 348px);
      height: var(--shape-more-panel-height, 760px);
    }

    :host([hidden]) {
      display: none;
    }

    .panel {
      width: 100%;
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      border-radius: 16px;
      border: 1px solid var(--linvo-border-color);
      background: var(--linvo-background-overlay-panel-color);
      box-shadow: var(--linvo-shadow-3);
      backdrop-filter: blur(16px);
    }

    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px 10px;
      border-bottom: 1px solid var(--linvo-border-color);
    }

    .panel-close {
      width: 28px;
      height: 28px;
      border: none;
      background: transparent;
      border-radius: 999px;
      color: var(--linvo-icon-color);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.18s ease;
    }

    .panel-close:hover {
      background: var(--linvo-hover-color);
    }

    .panel-title {
      font-size: 14px;
      font-weight: 600;
      line-height: 22px;
      color: var(--linvo-text-primary-color);
    }

    .panel-subtitle {
      font-size: 12px;
      line-height: 18px;
      color: var(--linvo-text-secondary-color);
    }

    .panel-body {
      flex: 1;
      min-height: 0;
      padding: 8px;
      overflow-y: auto;
      overflow-x: hidden;
      display: flex;
      flex-direction: column;
      gap: 10px;
      overscroll-behavior: contain;
    }

    .section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .section-title {
      padding: 0 6px;
      font-size: 12px;
      line-height: 18px;
      color: var(--linvo-text-secondary-color);
    }

    .shape-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 6px;
    }

    .shape-card {
      height: 72px;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      color: var(--linvo-icon-color);
      border: 1px solid transparent;
      cursor: pointer;
      transition:
        background-color 0.18s ease,
        border-color 0.18s ease,
        color 0.18s ease,
        transform 0.18s ease;
    }

    .shape-card:hover {
      background: var(--linvo-hover-color);
      transform: translateY(-1px);
    }

    .shape-card[active] {
      color: var(--linvo-primary-color);
      background: color-mix(
        in srgb,
        var(--linvo-primary-color) 12%,
        transparent
      );
      border-color: color-mix(
        in srgb,
        var(--linvo-primary-color) 28%,
        transparent
      );
    }

    .shape-card svg {
      flex-shrink: 0;
    }

    .shape-label {
      width: 100%;
      padding: 0 6px;
      text-align: center;
      font-size: 11px;
      line-height: 14px;
      color: inherit;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `;

  override connectedCallback(): void {
    super.connectedCallback();
    this._updatePosition();

    this._disposables.addFromEvent(window, 'resize', this._updatePosition);
    this._disposables.addFromEvent(window, 'scroll', this._updatePosition, {
      passive: true,
      capture: true,
    });

    const anchor = this._getAnchorContainer();
    if (anchor) {
      this._anchorResizeObserver = new ResizeObserver(() => {
        this._updatePosition();
      });
      this._anchorResizeObserver.observe(anchor);
      this._disposables.add(() => {
        this._anchorResizeObserver?.disconnect();
        this._anchorResizeObserver = null;
      });
    }
  }

  override updated(): void {
    this._updatePosition();
  }

  private _getAnchorContainer(): HTMLElement | null {
    if (!this.edgeless) return null;
    return (
      this.edgeless.closest('linvo-editor-container') ??
      this.edgeless.closest('.editor-shell') ??
      this.edgeless
    ) as HTMLElement | null;
  }

  private readonly _updatePosition = () => {
    const anchor = this._getAnchorContainer();
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();
    const panelWidth = 348;
    const horizontalGap = 12;
    const verticalGap = 12;
    const availableHeight = Math.max(220, rect.height - verticalGap * 2);
    const panelHeight = Math.min(760, availableHeight);
    const left = rect.right - horizontalGap - panelWidth;
    const top = rect.top + (rect.height - panelHeight) / 2;

    this.style.setProperty('--shape-more-panel-left', `${left}px`);
    this.style.setProperty('--shape-more-panel-top', `${top}px`);
    this.style.setProperty('--shape-more-panel-width', `${panelWidth}px`);
    this.style.setProperty('--shape-more-panel-height', `${panelHeight}px`);
  };

  private _renderShapeCard({ name, label }: ShapeOption) {
    const basicConfig = ShapeComponentConfig.find(item => item.name === name);
    const icon = basicConfig
      ? this.shapeStyle === ShapeStyle.General
        ? basicConfig.generalIcon
        : basicConfig.scribbledIcon
      : renderPresetShapeIcon(name as (typeof PRESET_SHAPE_TYPES)[number]);

    return html`<div
      class="shape-card"
      ?active=${this.selectedShape === name}
      @click=${() => this.onSelect(name)}
    >
      ${icon}
      <div class="shape-label">${label}</div>
    </div>`;
  }

  override render() {
    return html`
      <div class="panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">Shapes</div>
            <div class="panel-subtitle">Pick a shape to place on canvas</div>
          </div>
          <button class="panel-close" @click=${() => this.onClose?.()}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 4L12 12M12 4L4 12"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
              />
            </svg>
          </button>
        </div>

        <div class="panel-body">
          <section class="section">
            <div class="section-title">Basic</div>
            <div class="shape-grid">
              ${repeat(BASIC_SHAPES, shape => shape.name, shape =>
                this._renderShapeCard(shape)
              )}
            </div>
          </section>

          <section class="section">
            <div class="section-title">More Shapes</div>
            <div class="shape-grid">
              ${repeat(PRESET_SHAPES, shape => shape.name, shape =>
                this._renderShapeCard(shape)
              )}
            </div>
          </section>
        </div>
      </div>
    `;
  }

  @property({ attribute: false })
  accessor edgeless!: BlockComponent;

  @property({ attribute: false })
  accessor onSelect!: (name: ShapeName) => void;

  @property({ attribute: false })
  accessor onClose: (() => void) | null = null;

  @property({ attribute: false })
  accessor selectedShape: ShapeName = ShapeType.Rect;

  @property({ attribute: false })
  accessor shapeStyle: ShapeStyle = ShapeStyle.General;
}

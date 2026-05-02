import { adjustColorAlpha } from '@linvo-ui/components/color-picker';
import {
  BRUSH_LINE_WIDTHS,
  DefaultTheme,
  HIGHLIGHTER_LINE_WIDTHS,
} from '@linvo-core/content';
import {
  FeatureFlagService,
  ThemeProvider,
} from '@linvo-core/shared/services';
import type { ColorEvent } from '@linvo-core/shared/utils';
import { EdgelessToolbarToolMixin } from '@linvo-ui/edgeless-toolbar';
import { SignalWatcher } from '@linvo-core/global/lit';
import {
  computed,
  type ReadonlySignal,
  type Signal,
} from '@preact/signals-core';
import { css, html, LitElement, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

import { BrushTool } from '../../../brush-tool';
import { HighlighterTool } from '../../../highlighter-tool';
import { MagicBrushTool } from '../../../magic-brush-tool';
import { penInfoMap } from './consts';
import type { Pen, PenMap } from './types';

export class EdgelessPenMenu extends EdgelessToolbarToolMixin(
  SignalWatcher(LitElement)
) {
  static override styles = css`
    :host {
      display: flex;
      position: absolute;
      z-index: -1;
    }

      .pens {
        display: flex;
        height: 100%;
        padding: 0 4px;
        align-items: center;

        edgeless-tool-icon-button {
          display: flex;
        }

        .pen-wrapper {
          display: flex;
          min-width: 32px;
          height: 32px;
          align-items: center;
          justify-content: center;
          position: relative;
          border-radius: 10px;
          transition-property: color, transform;
          transition-duration: 180ms;
          transition-timing-function: ease;
          cursor: pointer;
        }

        .pen-wrapper:hover,
        .pen-wrapper:active,
        .pen-wrapper[data-active] {
          transform: scale(1.06);
        }

        .pen-wrapper svg {
          width: 20px;
          height: 20px;
        }
      }

    .menu-content {
      display: flex;
      align-items: center;
    }

    .magic-brush-content {
      color: var(--linvo-text-secondary-color);
      font-size: 12px;
      line-height: 18px;
      padding: 0 6px 0 2px;
      white-space: nowrap;
    }

    menu-divider {
      display: flex;
      align-self: center;
      height: 24px;
      margin: 0 9px;
    }
  `;

  private readonly _theme$ = computed(() => {
    return this.edgeless.std.get(ThemeProvider).theme$.value;
  });

  private readonly _onPickPen = (tool: Pen) => {
    this.pen$.value = tool;
    if (tool === 'brush') {
      this.setEdgelessTool(BrushTool);
    } else if (tool === 'highlighter') {
      this.setEdgelessTool(HighlighterTool);
    } else {
      this.setEdgelessTool(MagicBrushTool);
    }
  };

  private readonly _onPickColor = (e: ColorEvent) => {
    let color = e.detail.value;
    if (this.pen$.peek() === 'highlighter') {
      color = adjustColorAlpha(color, 0.3);
    }
    this.onChange({ color });
  };

  private readonly _onPickLineWidth = (e: CustomEvent<number>) => {
    e.stopPropagation();
    this.onChange({ lineWidth: e.detail });
  };

  override type = [BrushTool, HighlighterTool, MagicBrushTool];

  override render() {
    const {
      _theme$: { value: theme },
      colors$: {
        value: {
          brush: brushColor,
          highlighter: highlighterColor,
          magicBrush: magicBrushColor,
        },
      },
      penIconMap$: {
        value: {
          brush: brushIcon,
          highlighter: highlighterIcon,
          magicBrush: magicBrushIcon,
        },
      },
      penInfo$: {
        value: { type, color, lineWidth },
      },
    } = this;

    const lineWidths =
      type === 'brush' ? BRUSH_LINE_WIDTHS : HIGHLIGHTER_LINE_WIDTHS;

    return html`
      <edgeless-slide-menu>
        <div class="pens" slot="prefix">
          <edgeless-tool-icon-button
            class="edgeless-brush-button"
            .tooltip=${html`<linvo-tooltip-content-with-shortcut
              data-tip="${penInfoMap.brush.tip}"
              data-shortcut="${penInfoMap.brush.shortcut}"
            ></linvo-tooltip-content-with-shortcut>`}
            .tooltipOffset=${20}
            .hover=${false}
            @click=${() => this._onPickPen('brush')}
          >
            <div
              class="pen-wrapper"
              style=${styleMap({ color: brushColor })}
              ?data-active="${type === 'brush'}"
            >
              ${brushIcon}
            </div>
          </edgeless-tool-icon-button>

          <edgeless-tool-icon-button
            class="edgeless-highlighter-button"
            .tooltip=${html`<linvo-tooltip-content-with-shortcut
              data-tip="${penInfoMap.highlighter.tip}"
              data-shortcut="${penInfoMap.highlighter.shortcut}"
            ></linvo-tooltip-content-with-shortcut>`}
            .tooltipOffset=${20}
            .hover=${false}
            @click=${() => this._onPickPen('highlighter')}
          >
            <div
              class="pen-wrapper"
              style=${styleMap({ color: highlighterColor })}
              ?data-active="${type === 'highlighter'}"
            >
              ${highlighterIcon}
            </div>
          </edgeless-tool-icon-button>

          <edgeless-tool-icon-button
            class="edgeless-magic-brush-button"
            .tooltip=${html`<linvo-tooltip-content-with-shortcut
              data-tip="${penInfoMap.magicBrush.tip}"
              data-shortcut="${penInfoMap.magicBrush.shortcut}"
            ></linvo-tooltip-content-with-shortcut>`}
            .tooltipOffset=${20}
            .hover=${false}
            @click=${() => this._onPickPen('magicBrush')}
          >
            <div
              class="pen-wrapper"
              style=${styleMap({ color: magicBrushColor })}
              ?data-active="${type === 'magicBrush'}"
            >
              ${magicBrushIcon}
            </div>
          </edgeless-tool-icon-button>
          <menu-divider .vertical=${true}></menu-divider>
        </div>
        ${type === 'magicBrush'
          ? html`<div class="magic-brush-content">
              Draw and pause for 500ms to auto-convert the trail into a shape.
            </div>`
          : html`<div class="menu-content">
              <edgeless-line-width-panel
                .selectedSize=${lineWidth}
                .lineWidths=${lineWidths}
                @select=${this._onPickLineWidth}
              >
              </edgeless-line-width-panel>
              <menu-divider .vertical=${true}></menu-divider>
              <edgeless-color-panel
                class="one-way"
                @select=${this._onPickColor}
                .value=${color}
                .theme=${theme}
                .palettes=${DefaultTheme.StrokeColorShortPalettes}
                .shouldKeepColor=${true}
                .hasTransparent=${!this.edgeless.store
                  .get(FeatureFlagService)
                  .getFlag('enable_color_picker')}
              ></edgeless-color-panel>
            </div>`}
      </edgeless-slide-menu>
    `;
  }

  @property({ attribute: false })
  accessor onChange!: (props: Record<string, unknown>) => void;

  @property({ attribute: false })
  accessor colors$!: ReadonlySignal<PenMap<string>>;

  @property({ attribute: false })
  accessor penIconMap$!: ReadonlySignal<PenMap<TemplateResult>>;

  @property({ attribute: false })
  accessor pen$!: Signal<Pen>;

  @property({ attribute: false })
  accessor penInfo$!: ReadonlySignal<{
    type: Pen;
    color: string;
    icon: TemplateResult<1>;
    lineWidth: number;
    tip: string;
    shortcut: string;
  }>;
}

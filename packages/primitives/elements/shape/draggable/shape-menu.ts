import {
  DefaultTheme,
  isTransparent,
  type Palette,
  type ShapeName,
  ShapeStyle,
  ShapeType,
} from '@linvo-core/content';
import {
  EditPropsStore,
  FeatureFlagService,
  ThemeProvider,
} from '@linvo-core/shared/services';
import type { ColorEvent } from '@linvo-core/shared/utils';
import { SignalWatcher, WithDisposable } from '@linvo-core/global/lit';
import { StyleGeneralIcon, StyleScribbleIcon } from '@icons/lit';
import type { BlockComponent } from '@linvo-core/std';
import {
  GfxControllerIdentifier,
  type ToolOptionWithType,
} from '@linvo-core/std/gfx';
import { computed, effect, type Signal, signal } from '@preact/signals-core';
import { css, html, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { ShapeTool } from '../shape-tool';
import { ShapeComponentConfig } from '../toolbar';

export class EdgelessShapeMenu extends SignalWatcher(
  WithDisposable(LitElement)
) {
  private _morePanel: HTMLElementTagNameMap['edgeless-shape-more-panel'] | null =
    null;

  static override styles = css`
    :host {
      display: flex;
      z-index: -1;
    }
    .menu-content {
      display: flex;
      align-items: center;
    }
    .shape-type-container,
    .shape-style-container {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 14px;
    }
    .shape-type-container {
      gap: 10px;
    }
    .shape-type-main {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 14px;
    }
    .shape-more-trigger {
      position: relative;
      padding-left: 10px;
    }
    .shape-more-trigger::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 1px;
      height: 18px;
      background: var(--linvo-border-color);
    }
    .shape-type-container svg,
    .shape-style-container svg {
      fill: var(--linvo-icon-color);
      stroke: none;
    }
    menu-divider {
      height: 24px;
      margin: 0 9px;
    }
  `;

  private readonly _shapeName$: Signal<ShapeName> = signal(ShapeType.Rect);

  @property({ attribute: false })
  accessor edgeless!: BlockComponent;

  private readonly _props$ = computed(() => {
    const shapeName: ShapeName = this._shapeName$.value;
    const { shapeStyle, fillColor, strokeColor, radius } =
      this.edgeless.std.get(EditPropsStore).lastProps$.value[
        `shape:${shapeName}`
      ];
    return {
      shapeStyle,
      shapeName,
      fillColor,
      strokeColor,
      radius,
    };
  });

  private readonly _setFillColor = ({ key, value }: Palette) => {
    const filled = !isTransparent(value);
    const fillColor = value;
    const strokeColor = filled
      ? DefaultTheme.StrokeColorShortPalettes.find(
          palette => palette.key === key
        )?.value
      : DefaultTheme.StrokeColorShortMap.Grey;

    const { shapeName } = this._props$.value;
    this.edgeless.std
      .get(EditPropsStore)
      .recordLastProps(`shape:${shapeName}`, {
        filled,
        fillColor,
        strokeColor,
      });
    this.onChange(shapeName);
  };

  private readonly _setShapeStyle = (shapeStyle: ShapeStyle) => {
    const { shapeName } = this._props$.value;
    this.edgeless.std
      .get(EditPropsStore)
      .recordLastProps(`shape:${shapeName}`, {
        shapeStyle,
      });
    this.onChange(shapeName);
  };

  private readonly _theme$ = computed(() => {
    return this.edgeless.std.get(ThemeProvider).theme$.value;
  });

  @state()
  accessor showMorePanel = false;

  override connectedCallback(): void {
    super.connectedCallback();

    this._disposables.addFromEvent(
      document,
      'edgeless-shape-more-panel-close',
      () => {
        if (this.showMorePanel) {
          this.showMorePanel = false;
        }
      }
    );

    const gfx = this.edgeless.std.get(GfxControllerIdentifier);
    this._disposables.add(
      effect(() => {
        const value = gfx.tool.currentToolOption$.value;

        if (value && value.toolType === ShapeTool) {
          const shapeName = (value as ToolOptionWithType<ShapeTool>).options
            ?.shapeName;
          if (shapeName) {
            this._shapeName$.value = shapeName;
          }
        } else if (this.showMorePanel) {
          this.showMorePanel = false;
        }
      })
    );
  }

  override disconnectedCallback(): void {
    this._disposeMorePanel();
    super.disconnectedCallback();
  }

  override updated(): void {
    this._syncMorePanel();
  }

  private _disposeMorePanel() {
    this._morePanel?.remove();
    this._morePanel = null;
  }

  private _syncMorePanel() {
    if (!this.showMorePanel) {
      this._disposeMorePanel();
      return;
    }

    const { shapeStyle, shapeName } = this._props$.value;

    if (!this._morePanel) {
      this._morePanel = document.createElement('edgeless-shape-more-panel');
      document.body.append(this._morePanel);
    }

    this._morePanel.edgeless = this.edgeless;
    this._morePanel.shapeStyle = shapeStyle;
    this._morePanel.selectedShape = shapeName;
    this._morePanel.onSelect = (name: ShapeName) => {
      this.onChange(name);
      this.showMorePanel = false;
    };
    this._morePanel.onClose = () => {
      this.showMorePanel = false;
    };
  }

  override render() {
    const { fillColor, shapeStyle, shapeName } = this._props$.value;

    return html`
      <edgeless-slide-menu>
        <div class="menu-content">
          ${
            when(
              this.edgeless.store
                .get(FeatureFlagService)
                .getFlag('enable_edgeless_scribbled_style'),
              () => html`
                <div class="shape-style-container">
                  <edgeless-tool-icon-button
                    .tooltip=${'General'}
                    .active=${shapeStyle === ShapeStyle.General}
                    .activeMode=${'background'}
                    .iconSize=${'20px'}
                    @click=${() => {
                      this._setShapeStyle(ShapeStyle.General);
                    }}
                  >
                    ${StyleGeneralIcon()}
                  </edgeless-tool-icon-button>
                  <edgeless-tool-icon-button
                    .tooltip=${'Scribbled'}
                    .active=${shapeStyle === ShapeStyle.Scribbled}
                    .activeMode=${'background'}
                    .iconSize=${'20px'}
                    @click=${() => {
                      this._setShapeStyle(ShapeStyle.Scribbled);
                    }}
                  >
                    ${StyleScribbleIcon()}
                  </edgeless-tool-icon-button>
                </div>
                <menu-divider .vertical=${true}></menu-divider>
              `
            )
          }
          <div class="shape-type-container">
            <div class="shape-type-main">
              ${ShapeComponentConfig.map(
                ({ name, generalIcon, scribbledIcon, tooltip }) => {
                  return html`
                    <edgeless-tool-icon-button
                      .tooltip=${tooltip}
                      .active=${shapeName === name}
                      .activeMode=${'background'}
                      .iconSize=${'20px'}
                      @click=${() => this.onChange(name)}
                    >
                      ${shapeStyle === ShapeStyle.General
                        ? generalIcon
                        : scribbledIcon}
                    </edgeless-tool-icon-button>
                  `;
                }
              )}
            </div>
            <div class="shape-more-trigger">
              <edgeless-tool-icon-button
                .tooltip=${'More'}
                .active=${this.showMorePanel}
                .activeMode=${'background'}
                .iconSize=${'20px'}
                @click=${() => {
                  this.showMorePanel = !this.showMorePanel;
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 1024 1024"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M298.666667 586.666667a74.666667 74.666667 0 1 1 0-149.333334 74.666667 74.666667 0 0 1 0 149.333334z m213.333333 0a74.666667 74.666667 0 1 1 0-149.333334 74.666667 74.666667 0 0 1 0 149.333334z m213.333333 0a74.666667 74.666667 0 1 1 0-149.333334 74.666667 74.666667 0 0 1 0 149.333334z"
                    fill="currentColor"
                  ></path>
                </svg>
              </edgeless-tool-icon-button>
            </div>
          </div>
          <menu-divider .vertical=${true}></menu-divider>
          <edgeless-color-panel
            class="one-way"
            .value=${fillColor}
            .theme=${this._theme$.value}
            .palettes=${DefaultTheme.FillColorShortPalettes}
            .hasTransparent=${!this.edgeless.store
              .get(FeatureFlagService)
              .getFlag('enable_color_picker')}
            @select=${(e: ColorEvent) => this._setFillColor(e.detail)}
          ></edgeless-color-panel>
        </div>
      </edgeless-slide-menu>
    `;
  }

  @property({ attribute: false })
  accessor onChange!: (name: ShapeName) => void;
}

import { ShapeType } from '@linvo-core/content';
import { EdgelessToolbarToolMixin, ExcalidrawChevronDownIcon, ExcalidrawShapeIcon, } from '@linvo-ui/edgeless-toolbar';
import { SignalWatcher } from '@linvo-core/global/lit';
import { css, html, LitElement } from 'lit';
import { ShapeTool } from '../shape-tool';
export class EdgelessShapeToolButton extends EdgelessToolbarToolMixin(SignalWatcher(LitElement)) {
    constructor() {
        super(...arguments);
        this._handleShapeClick = (shape) => {
            this.setEdgelessTool(this.type, {
                shapeName: shape.name,
            });
            if (!this.popper)
                this._toggleMenu();
        };
        this._handleWrapperClick = () => {
            if (this.tryDisposePopper())
                return;
            this.setEdgelessTool(this.type, {
                shapeName: ShapeType.Rect,
            });
            if (!this.popper)
                this._toggleMenu();
        };
        this.type = ShapeTool;
    }
    static { this.styles = css `
    :host {
      display: flex;
    }
  `; }
    _toggleMenu() {
        this.createPopper('edgeless-shape-menu', this, {
            setProps: ele => {
                ele.edgeless = this.edgeless;
                ele.onChange = (shapeName) => {
                    this.setEdgelessTool(this.type, {
                        shapeName,
                    });
                    this._updateOverlay();
                };
            },
        });
    }
    _updateOverlay() {
        const controller = this.gfx.tool.currentTool$.peek();
        if (controller instanceof ShapeTool) {
            controller.createOverlay();
        }
    }
    firstUpdated() {
        this.disposables.add(this.edgeless.bindHotKey({
            s: ctx => {
                // `page.keyboard.press('Shift+s')` in playwright will also trigger this 's' key event
                if (ctx.get('keyboardState').raw.shiftKey)
                    return;
                const gfx = this.gfx;
                if (gfx.viewport.locked || gfx.selection.editing)
                    return;
                let shapeName = gfx.tool.get(ShapeTool).activatedOption.shapeName;
                if (gfx.tool.currentToolName$.peek() === ShapeTool.toolName) {
                    shapeName = gfx.tool.get(ShapeTool).cycleShapeName('next');
                }
                this.setEdgelessTool(this.type, {
                    shapeName,
                });
            },
        }, { global: true }));
    }
    render() {
        const { active } = this;
        return html `
      <edgeless-tool-icon-button
        class="edgeless-shape-button"
        .tooltip=${this.popper
            ? ''
            : html `<linvo-tooltip-content-with-shortcut
              data-tip="${'Shape'}"
              data-shortcut="${'S'}"
            ></linvo-tooltip-content-with-shortcut>`}
        .tipPosition=${'bottom'}
        .tooltipOffset=${10}
        .active=${active}
        .activeMode=${'background'}
        .iconContainerPadding=${[8, 10]}
        .iconSize=${'20px'}
        @click=${this._handleWrapperClick}
      >
        ${ExcalidrawShapeIcon()} ${ExcalidrawChevronDownIcon()}
      </edgeless-tool-icon-button>
    `;
    }
}

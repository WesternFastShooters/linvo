import {
  DefaultTool,
  EdgelessCRUDIdentifier,
} from '@blocksuite/affine-block-surface';
import { EmptyTool } from '@blocksuite/affine-gfx-pointer';
import { TextTool } from '@blocksuite/affine-gfx-text';
import type {
  MindmapElementModel,
  MindmapStyle,
} from '@blocksuite/affine-model';
import {
  EditPropsStore,
  ThemeProvider,
  ViewportElementProvider,
} from '@blocksuite/affine-shared/services';
import {
  EdgelessDraggableElementController,
  EdgelessToolbarToolMixin,
  ExcalidrawChevronDownIcon,
  ExcalidrawMindmapIcon,
} from '@blocksuite/affine-widget-edgeless-toolbar';
import type { Bound } from '@blocksuite/global/gfx';
import { SignalWatcher } from '@blocksuite/global/lit';
import { computed } from '@preact/signals-core';
import { css, html, LitElement, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { repeat } from 'lit/directives/repeat.js';
import { styleMap } from 'lit/directives/style-map.js';

import { getMindMaps } from './assets.js';
import {
  type DraggableTool,
  getMindmapRender,
  mediaConfig,
  mediaRender,
  mindmapConfig,
  textConfig,
  textRender,
  toolConfig2StyleObj,
} from './basket-elements.js';
import {
  basketIconDark,
  basketIconLight,
  mindmapMenuMediaIcon,
  textIcon,
} from './icons.js';
import { importMindmap } from './utils/import-mindmap.js';

export class EdgelessMindmapToolButton extends EdgelessToolbarToolMixin(
  SignalWatcher(LitElement)
) {
  static override styles = css`
    :host {
      display: flex;
    }
  `;

  private readonly _style$ = computed(() => {
    const { style } =
      this.edgeless.std.get(EditPropsStore).lastProps$.value.mindmap;
    return style;
  });

  draggableController!: EdgelessDraggableElementController<DraggableTool>;

  override enableActiveBackground = true;

  override type = [EmptyTool, TextTool];

  get draggableTools(): DraggableTool[] {
    const style = this._style$.value;
    const mindmap =
      this.mindmaps.find(m => m.style === style) || this.mindmaps[0];
    return [
      {
        name: 'media',
        icon: mindmapMenuMediaIcon,
        config: mediaConfig,
        standardWidth: 100,
        render: mediaRender,
      },
      {
        name: 'text',
        icon: textIcon,
        config: textConfig,
        standardWidth: 100,
        render: textRender,
      },
      {
        name: 'mindmap',
        icon: mindmap.icon,
        config: mindmapConfig,
        standardWidth: 350,
        render: getMindmapRender(style),
      },
    ];
  }

  get mindmaps() {
    return getMindMaps(this.theme);
  }

  get crud() {
    return this.edgeless.std.get(EdgelessCRUDIdentifier);
  }

  private _toggleMenu() {
    if (this.tryDisposePopper()) return;
    this.setEdgelessTool(DefaultTool);

    const menu = this.createPopper('edgeless-mindmap-menu', this);
    Object.assign(menu.element, {
      edgeless: this.edgeless,
      onActiveStyleChange: (style: MindmapStyle) => {
        this.edgeless.std.get(EditPropsStore).recordLastProps('mindmap', {
          style,
        });
      },
      onImportMindMap: (bound: Bound) => {
        return importMindmap(bound).then(mindmap => {
          const id = this.crud.addElement('mindmap', {
            children: mindmap,
            layoutType: mindmap?.layoutType === 'left' ? 1 : 0,
          });
          if (!id) return;
          const element = this.crud.getElementById(id) as MindmapElementModel;

          this.tryDisposePopper();
          this.setEdgelessTool(DefaultTool);
          this.gfx.selection.set({
            elements: [element.tree.id],
            editing: false,
          });
        });
      },
    });
  }

  initDragController() {
    if (!this.edgeless || !this.toolbarContainer) return;
    if (this.draggableController) return;
    this.draggableController = new EdgelessDraggableElementController(this, {
      edgeless: this.edgeless,
      scopeElement: this.toolbarContainer,
      standardWidth: 100,
      clickToDrag: false,
      onOverlayCreated: (overlay, { data }) => {
        const tool = this.draggableTools.find(t => t.name === data.name);
        if (!tool) return;

        // recover the rotation
        const rotate = tool.config?.hover?.r ?? tool.config?.default?.r ?? 0;
        overlay.element.style.setProperty('--rotate', rotate + 'deg');
        setTimeout(() => {
          overlay.transitionWrapper.style.setProperty(
            '--rotate',
            -rotate + 'deg'
          );
        }, 50);

        // set the scale (without transition)
        const scale = tool.config?.hover?.s ?? tool.config?.default?.s ?? 1;
        overlay.element.style.setProperty('--scale', `${scale}`);

        // a workaround to handle getBoundingClientRect() when the element is rotated
        const _left = parseInt(overlay.element.style.left);
        const _top = parseInt(overlay.element.style.top);
        if (data.name === 'mindmap') {
          overlay.element.style.left = _left + 3 + 'px';
          overlay.element.style.top = _top + 5 + 'px';
        } else if (data.name === 'text') {
          overlay.element.style.left = _left + 0 + 'px';
          overlay.element.style.top = _top + 3 + 'px';
        }
        this.readyToDrop = true;
      },
      onCanceled: overlay => {
        overlay.transitionWrapper.style.transformOrigin = 'unset';
        overlay.transitionWrapper.style.setProperty('--rotate', '0deg');
        this.readyToDrop = false;
      },
      onDrop: (el, bound) => {
        el.data
          .render(bound, this.edgeless)
          .then(id => {
            if (!id) return;
            this.readyToDrop = false;
            if (el.data.name === 'mindmap') {
              this.setEdgelessTool(DefaultTool);
              this.gfx.selection.set({
                elements: [id],
                editing: false,
              });
            } else if (el.data.name === 'text') {
              this.setEdgelessTool(DefaultTool);
            }
          })
          .catch(console.error);
      },
    });

    this.edgeless.bindHotKey(
      {
        m: () => {
          const gfx = this.gfx;
          const locked = gfx.viewport.locked;
          if (locked) return;
          if (gfx.selection.editing) return;

          if (this.readyToDrop) {
            // change the style
            const activeIndex = this.mindmaps.findIndex(
              m => m.style === this._style$.value
            );
            const nextIndex = (activeIndex + 1) % this.mindmaps.length;
            const next = this.mindmaps[nextIndex];
            this.edgeless.std.get(EditPropsStore).recordLastProps('mindmap', {
              style: next.style,
            });
            const tool = this.draggableTools.find(t => t.name === 'mindmap');
            this.draggableController.updateElementInfo({
              data: tool,
              preview: next.icon,
            });
            return;
          }
          this.setEdgelessTool(EmptyTool);
          const icon = this.mindmapElement;
          const { x, y } = gfx.tool.lastMouseViewPos$.peek();
          const { viewport } = this.edgeless.std.get(ViewportElementProvider);
          const { left, top } = viewport;
          const clientPos = { x: x + left, y: y + top };
          this.draggableController.dragAndMoveTo(icon, clientPos);
        },
      },
      { global: true }
    );

    // since there is not a tool called mindmap, we need to cancel the drag when the tool is changed
    this.disposables.add(
      this.gfx.tool.currentToolName$.subscribe(toolName => {
        // FIXME: remove the assertion after gfx tool refactor
        if ((toolName as string) !== 'empty' && this.readyToDrop) {
          this.draggableController.cancel();
        }
      })
    );
  }

  override render() {
    const { popper } = this;
    const { draggingElement } = this.draggableController?.states || {};
    const active = popper || draggingElement;

    return html`
      <edgeless-tool-icon-button
        class="edgeless-mindmap-button"
        .tooltip=${popper ? '' : 'Mindmap'}
        .tipPosition=${'bottom'}
        .tooltipOffset=${10}
        .active=${!!active}
        .activeMode=${'background'}
        .iconContainerPadding=${[8, 10]}
        .iconSize=${'20px'}
        @click=${this._toggleMenu}
      >
        ${ExcalidrawMindmapIcon()} ${ExcalidrawChevronDownIcon()}
      </edgeless-tool-icon-button>
    `;
  }

  override updated(_changedProperties: Map<PropertyKey, unknown>) {
    const controllerRequiredProps = ['edgeless', 'toolbarContainer'] as const;
    if (
      controllerRequiredProps.some(p => _changedProperties.has(p)) &&
      !this.draggableController
    ) {
      this.initDragController();
    }
  }

  @property({ type: Boolean })
  accessor enableBlur = true;

  @query('.basket-tool-item.mindmap')
  accessor mindmapElement!: HTMLElement;

  @state()
  accessor readyToDrop = false;
}

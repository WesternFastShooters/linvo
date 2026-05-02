import { DefaultTool } from '@linvo-core/block-surface';
import { SignalWatcher } from '@linvo-core/global/lit';
import { EdgelessToolbarToolMixin } from '@linvo-ui/edgeless-toolbar';
import { SeniorToolExtension } from '@linvo-ui/edgeless-toolbar';
import { css, html, LitElement } from 'lit';
import { getMermaidInsertController } from './controller';
export class EdgelessMermaidButton extends EdgelessToolbarToolMixin(SignalWatcher(LitElement)) {
    constructor() {
        super(...arguments);
        this.enableActiveBackground = true;
        this.type = DefaultTool;
    }
    static { this.styles = css `
    :host {
      display: block;
    }

    .content {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 0;
    }

    .content svg {
      display: block;
      width: 20px;
      height: 20px;
      fill: currentColor;
    }
  `; }
    render() {
        const edgeless = this.edgeless;
        const controller = getMermaidInsertController(edgeless);
        const active = controller.state.open.value;
        return html `
      <edgeless-toolbar-button
        .active=${active}
        .activeMode=${'background'}
        .iconContainerPadding=${[8, 10]}
        .iconSize=${'18px'}
        .tooltip=${html `<linvo-tooltip-content-with-shortcut
          data-tip="${'Mermaid'}"
          data-shortcut="${'M'}"
        ></linvo-tooltip-content-with-shortcut>`}
        .tooltipOffset=${5}
        @click=${this.openModal}
      >
        <span class="content">
          <svg viewBox="0 0 1024 1024" aria-hidden="true">
            <path
              d="M872.704 179.2c5.888 0 11.8272 0 17.7152 0.3584l31.3856 1.28-6.7584 27.0848a426.5984 426.5984 0 0 1-185.8048 366.3872 189.44 189.44 0 0 0-81.92 156.672v148.7872h-302.08v-148.7872a189.44 189.44 0 0 0-81.92-156.7744 426.8032 426.8032 0 0 1-185.6512-370.1248l0.9728-23.552 23.552-0.9728c5.8368 0 11.7248-0.3584 17.5616-0.3584a426.9056 426.9056 0 0 1 376.7808 226.56A426.752 426.752 0 0 1 873.216 179.2zM595.968 828.5696v-97.28a240.64 240.64 0 0 1 104.3456-198.9632 375.3984 375.3984 0 0 0 163.84-301.568 376.4224 376.4224 0 0 0-343.8592 246.9888l-24.064 66.1504-24.064-66.1504a376.576 376.576 0 0 0-343.9104-246.9888 375.552 375.552 0 0 0 163.84 301.4656 240.64 240.64 0 0 1 104.3968 199.0656v97.28z"
              stroke="currentColor"
              stroke-width="20"
              paint-order="stroke fill"
              stroke-linejoin="round"
            ></path>
          </svg>
        </span>
      </edgeless-toolbar-button>
    `;
    }
    openModal() {
        document.dispatchEvent(new CustomEvent('edgeless-shape-more-panel-close'));
        const edgeless = this.edgeless;
        getMermaidInsertController(edgeless).open(edgeless);
    }
}
export const mermaidSeniorTool = SeniorToolExtension('mermaid', ({ block }) => {
    return {
        name: 'Mermaid',
        content: html `<edgeless-mermaid-button
      .edgeless=${block}
    ></edgeless-mermaid-button>`,
    };
});

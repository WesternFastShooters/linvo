import type { NoteBlockModel } from '@linvo/linvo-model';
import { BlockComponent } from '@linvo/std';
import { css, html } from 'lit';

export class NoteBlockComponent extends BlockComponent<NoteBlockModel> {
  static override styles = css`
    .linvo-note-block-container {
      display: flow-root;
    }
    .linvo-note-block-container.selected {
      background-color: var(--linvo-hover-color);
    }
  `;

  override connectedCallback() {
    super.connectedCallback();
  }

  override renderBlock() {
    return html`
      <div class="linvo-note-block-container">
        <div class="linvo-block-children-container">
          ${this.renderChildren(this.model)}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'linvo-note': NoteBlockComponent;
  }
}

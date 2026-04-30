import * as icons from '@icons/lit';
import { ShadowlessElement } from '@linvo/std';
import { css, html, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';

import { uniMap } from './uni-component/operation.js';
import { createUniComponentFromWebComponent } from './uni-component/uni-component.js';

export class LinvoLitIcon extends ShadowlessElement {
  static override styles = css`
    linvo-lit-icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    linvo-lit-icon svg {
      fill: var(--linvo-icon-color);
    }
  `;

  protected override render(): unknown {
    const createIcon = icons[this.name] as () => TemplateResult;
    return html`${createIcon?.()}`;
  }

  @property({ attribute: false })
  accessor name!: keyof typeof icons;
}

const litIcon = createUniComponentFromWebComponent<{ name: string }>(
  LinvoLitIcon
);
export const createIcon = (name: keyof typeof icons) => {
  return uniMap(litIcon, () => ({ name }));
};

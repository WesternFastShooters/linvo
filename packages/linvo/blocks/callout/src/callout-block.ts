import { CaptionedBlockComponent } from '@linvo/linvo-components/caption';
import { createLitPortal } from '@linvo/linvo-components/portal';
import { DefaultInlineManagerExtension } from '@linvo/linvo-inline-preset';
import { type CalloutBlockModel } from '@linvo/linvo-model';
import { EDGELESS_TOP_CONTENTEDITABLE_SELECTOR } from '@linvo/linvo-shared/consts';
import {
  DocModeProvider,
  ThemeProvider,
} from '@linvo/linvo-shared/services';
import { unsafeCSSVarV2 } from '@linvo/linvo-shared/theme';
import type { BlockComponent } from '@linvo/std';
import { flip, offset } from '@floating-ui/dom';
import { css, html } from 'lit';
import { query } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
export class CalloutBlockComponent extends CaptionedBlockComponent<CalloutBlockModel> {
  static override styles = css`
    :host {
      display: block;
      margin: 8px 0;
    }

    .linvo-callout-block-container {
      display: flex;
      padding: 5px 10px;
      border-radius: 8px;
      background-color: ${unsafeCSSVarV2('block/callout/background/grey')};
    }

    .linvo-callout-emoji-container {
      margin-right: 10px;
      margin-top: 14px;
      user-select: none;
      font-size: 1.2em;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .linvo-callout-emoji:hover {
      cursor: pointer;
      opacity: 0.7;
    }

    .linvo-callout-children {
      flex: 1;
      min-width: 0;
      padding-left: 10px;
    }
  `;

  private _emojiMenuAbortController: AbortController | null = null;
  private readonly _toggleEmojiMenu = () => {
    if (this._emojiMenuAbortController) {
      this._emojiMenuAbortController.abort();
    }
    this._emojiMenuAbortController = new AbortController();

    const theme = this.std.get(ThemeProvider).theme$.value;

    createLitPortal({
      template: html`<linvo-emoji-menu
        .theme=${theme}
        .onEmojiSelect=${(data: any) => {
          this.model.props.emoji = data.native;
        }}
      ></linvo-emoji-menu>`,
      portalStyles: {
        zIndex: 'var(--linvo-z-index-popover)',
      },
      container: this.host,
      computePosition: {
        referenceElement: this._emojiButton,
        placement: 'bottom-start',
        middleware: [flip(), offset(4)],
        autoUpdate: { animationFrame: true },
      },
      abortController: this._emojiMenuAbortController,
      closeOnClickAway: true,
    });
  };

  get attributeRenderer() {
    return this.inlineManager.getRenderer();
  }

  get attributesSchema() {
    return this.inlineManager.getSchema();
  }

  get embedChecker() {
    return this.inlineManager.embedChecker;
  }

  get inlineManager() {
    return this.std.get(DefaultInlineManagerExtension.identifier);
  }

  @query('.linvo-callout-emoji')
  private accessor _emojiButton!: HTMLElement;

  override get topContenteditableElement() {
    if (this.std.get(DocModeProvider).getEditorMode() === 'edgeless') {
      return this.closest<BlockComponent>(
        EDGELESS_TOP_CONTENTEDITABLE_SELECTOR
      );
    }
    return this.rootComponent;
  }

  override renderBlock() {
    const emoji = this.model.props.emoji$.value;
    return html`
      <div class="linvo-callout-block-container">
        <div
          @click=${this._toggleEmojiMenu}
          contenteditable="false"
          class="linvo-callout-emoji-container"
          style=${styleMap({
            display: emoji.length === 0 ? 'none' : undefined,
          })}
        >
          <span class="linvo-callout-emoji">${emoji}</span>
        </div>
        <div class="linvo-callout-children">
          ${this.renderChildren(this.model)}
        </div>
      </div>
    `;
  }
}

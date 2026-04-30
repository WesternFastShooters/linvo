import { scrollbarStyle } from '@linvo/linvo-shared/styles';
import { unsafeCSSVarV2 } from '@linvo/linvo-shared/theme';
import { css } from 'lit';

export const codeBlockStyles = css`
  linvo-code {
    display: block;
  }

  .linvo-code-block-container {
    font-size: var(--linvo-font-xs);
    line-height: var(--linvo-line-height);
    position: relative;
    padding: 32px 20px;
    background: var(--linvo-background-code-block);
    border-radius: 10px;
    box-sizing: border-box;
  }

  .linvo-code-block-container.mobile {
    padding: 12px;
  }

  .linvo-code-block-container.highlight-comment {
    outline: 2px solid ${unsafeCSSVarV2('block/comment/highlightUnderline')};
  }

  ${scrollbarStyle('.linvo-code-block-container rich-text')}

  .linvo-code-block-container .inline-editor {
    font-family: var(--linvo-font-code-family);
    font-variant-ligatures: none;
  }

  .linvo-code-block-container v-line {
    position: relative;
    display: inline-grid !important;
    grid-template-columns: auto minmax(0, 1fr);
  }

  .linvo-code-block-container.disable-line-numbers v-line {
    grid-template-columns: unset;
  }

  .linvo-code-block-container div:has(> v-line) {
    display: grid;
  }

  .linvo-code-block-container .line-number {
    position: sticky;
    text-align: left;
    padding-right: 12px;
    width: 32px;
    word-break: break-word;
    white-space: nowrap;
    left: -0.5px;
    z-index: 1;
    background: var(--linvo-background-code-block);
    font-size: var(--linvo-font-xs);
    line-height: var(--linvo-line-height);
    color: var(--linvo-text-secondary);
    box-sizing: border-box;
    user-select: none;
  }

  .linvo-code-block-container.disable-line-numbers .line-number {
    display: none;
  }

  linvo-code .linvo-code-block-preview {
    padding: 12px;
  }
`;

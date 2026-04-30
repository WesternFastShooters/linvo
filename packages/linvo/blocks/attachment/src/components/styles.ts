import { fontXSStyle, panelBaseStyle } from '@linvo/linvo-shared/styles';
import { css } from 'lit';

export const renameStyles = css`
  ${panelBaseStyle('.linvo-attachment-rename-container')}
  .linvo-attachment-rename-container {
    position: relative;
    display: flex;
    align-items: center;
    width: 320px;
    gap: 12px;
    padding: 12px;
    z-index: var(--linvo-z-index-popover);
  }

  .linvo-attachment-rename-input-wrapper {
    display: flex;
    min-width: 280px;
    height: 30px;
    box-sizing: border-box;
    padding: 4px 10px;
    background: var(--linvo-white-10);
    border-radius: 4px;
    border: 1px solid var(--linvo-border-color);
  }

  .linvo-attachment-rename-input-wrapper:focus-within {
    border-color: var(--linvo-blue-700);
    box-shadow: var(--linvo-active-shadow);
  }

  .linvo-attachment-rename-input-wrapper input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    color: var(--linvo-text-primary-color);
  }
  ${fontXSStyle('.linvo-attachment-rename-input-wrapper input')}

  .linvo-attachment-rename-input-wrapper input::placeholder {
    color: var(--linvo-placeholder-color);
  }

  .linvo-attachment-rename-extension {
    font-size: var(--linvo-font-xs);
    color: var(--linvo-text-secondary-color);
  }

  .linvo-attachment-rename-overlay-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: var(--linvo-z-index-popover);
  }
`;

export const styles = css`
  :host {
    z-index: 1;
  }
`;

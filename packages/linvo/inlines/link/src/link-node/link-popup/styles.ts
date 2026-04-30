import { fontSMStyle, panelBaseStyle } from '@linvo/linvo-shared/styles';
import { css } from 'lit';

const editLinkStyle = css`
  .linvo-link-edit-popover {
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: repeat(2, 1fr);
    grid-template-areas:
      'text-area .'
      'link-area btn';
    justify-items: center;
    align-items: center;
    width: 320px;
    gap: 8px 12px;
    padding: 8px;
    box-sizing: content-box;
  }

  ${fontSMStyle('.linvo-link-edit-popover label')}
  .linvo-link-edit-popover label {
    box-sizing: border-box;
    color: var(--linvo-icon-color);
    font-weight: 400;
  }

  ${fontSMStyle('.linvo-link-edit-popover input')}
  .linvo-link-edit-popover input {
    color: inherit;
    padding: 0;
    border: none;
    background: transparent;
    color: var(--linvo-text-primary-color);
  }
  .linvo-link-edit-popover input::placeholder {
    color: var(--linvo-placeholder-color);
  }
  input:focus {
    outline: none;
  }
  .linvo-link-edit-popover input:focus ~ label,
  .linvo-link-edit-popover input:active ~ label {
    color: var(--linvo-primary-color);
  }

  .linvo-edit-area {
    width: 280px;
    padding: 4px 10px;
    display: grid;
    gap: 8px;
    grid-template-columns: 26px auto;
    grid-template-rows: repeat(1, 1fr);
    grid-template-areas: 'label input';
    user-select: none;
    box-sizing: border-box;

    border: 1px solid var(--linvo-border-color);
    box-sizing: border-box;

    outline: none;
    border-radius: 4px;
    background: transparent;
  }
  .linvo-edit-area:focus-within {
    border-color: var(--linvo-blue-700);
    box-shadow: var(--linvo-active-shadow);
  }

  .linvo-edit-area.text {
    grid-area: text-area;
  }

  .linvo-edit-area.link {
    grid-area: link-area;
  }

  .linvo-edit-label {
    grid-area: label;
  }

  .linvo-edit-input {
    grid-area: input;
  }

  .linvo-confirm-button {
    grid-area: btn;
    user-select: none;
  }
`;

export const linkPopupStyle = css`
  :host {
    box-sizing: border-box;
  }

  .mock-selection {
    position: absolute;
    background-color: rgba(35, 131, 226, 0.28);
  }

  ${panelBaseStyle('.popover-container')}
  .popover-container {
    z-index: var(--linvo-z-index-popover);
    animation: linvo-popover-fade-in 0.2s ease;
    position: absolute;
  }

  @keyframes linvo-popover-fade-in {
    from {
      opacity: 0;
      transform: translateY(-3px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .overlay-root {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: var(--linvo-z-index-popover);
  }

  .mock-selection-container {
    pointer-events: none;
  }

  .linvo-link-popover.create {
    display: flex;
    gap: 12px;
    padding: 8px;

    color: var(--linvo-text-primary-color);
  }

  .linvo-link-popover-input {
    min-width: 280px;
    height: 30px;
    box-sizing: border-box;
    padding: 4px 10px;
    background: var(--linvo-white-10);
    border-radius: 4px;
    border-width: 1px;
    border-style: solid;
    border-color: var(--linvo-border-color);
    color: var(--linvo-text-primary-color);
  }
  ${fontSMStyle('.linvo-link-popover-input')}
  .linvo-link-popover-input::placeholder {
    color: var(--linvo-placeholder-color);
  }
  .linvo-link-popover-input:focus {
    border-color: var(--linvo-blue-700);
    box-shadow: var(--linvo-active-shadow);
  }

  ${editLinkStyle}
`;

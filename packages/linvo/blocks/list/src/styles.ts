import { css } from 'lit';

export const listPrefix = css`
  .linvo-list-block__prefix {
    display: flex;
    color: var(--linvo-blue-700);
    font-size: var(--linvo-font-sm);
    user-select: none;
    position: relative;
  }

  .linvo-list-block__numbered {
    min-width: 22px;
    height: 24px;
    margin-left: 2px;
  }

  .linvo-list-block__todo-prefix {
    display: flex;
    align-items: center;
    cursor: pointer;
    width: 24px;
    height: 24px;
    color: var(--linvo-icon-color);
  }

  .linvo-list-block__todo-prefix.readonly {
    cursor: default;
  }

  .linvo-list-block__todo-prefix > svg {
    width: 20px;
    height: 20px;
  }
`;

export const listBlockStyles = css`
  linvo-list {
    display: block;
    font-size: var(--linvo-font-base);
  }

  linvo-list code {
    font-size: calc(var(--linvo-font-base) - 3px);
    padding: 0px 4px 2px;
  }

  .linvo-list-block-container {
    box-sizing: border-box;
    border-radius: 4px;
    position: relative;
  }
  .linvo-list-block-container .linvo-list-block-container {
    margin-top: 0;
  }
  .linvo-list-rich-text-wrapper {
    position: relative;
    display: flex;
  }
  .linvo-list-rich-text-wrapper rich-text {
    flex: 1;
  }

  .linvo-list--checked {
    color: var(--linvo-text-secondary-color);
  }

  ${listPrefix}
`;

import { unsafeCSSVar, unsafeCSSVarV2 } from '@linvo/linvo-shared/theme';
import { baseTheme } from '@theme';
import { css, unsafeCSS } from 'lit';

export const styles = css`
  bookmark-card {
    display: block;
    height: 100%;
    width: 100%;
  }

  .linvo-bookmark-card {
    container: linvo-bookmark-card / inline-size;
    margin: 0 auto;
    box-sizing: border-box;
    display: flex;
    width: 100%;

    border-radius: 8px;
    border: 1px solid var(--linvo-background-tertiary-color);

    background: var(--linvo-background-primary-color);
    user-select: none;
  }

  .linvo-bookmark-content {
    width: calc(100% - 204px);
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    align-self: stretch;
    gap: 4px;
    padding: 12px;
  }

  .linvo-bookmark-content-title {
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;

    align-self: stretch;
  }

  .linvo-bookmark-content-title-icon {
    display: flex;
    width: 16px;
    height: 16px;
    justify-content: center;
    align-items: center;
  }

  .linvo-bookmark-content-title-icon img,
  .linvo-bookmark-content-title-icon object,
  .linvo-bookmark-content-title-icon svg {
    width: 16px;
    height: 16px;
    fill: var(--linvo-background-primary-color);
  }

  .linvo-bookmark-content-title-text {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;

    word-break: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--linvo-text-primary-color);

    font-family: var(--linvo-font-family);
    font-size: var(--linvo-font-sm);
    font-style: normal;
    font-weight: 600;
    line-height: 22px;
  }

  .linvo-bookmark-content-description {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;

    flex-grow: 1;

    white-space: normal;
    word-break: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--linvo-text-primary-color);

    font-family: var(--linvo-font-family);
    font-size: var(--linvo-font-xs);
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
  }

  .linvo-bookmark-content-url {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 4px;
    width: max-content;
    max-width: 100%;
  }

  .linvo-bookmark-content-url > span {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;

    word-break: break-all;
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--linvo-text-secondary-color);

    font-family: ${unsafeCSS(baseTheme.fontSansFamily)};
    font-size: var(--linvo-font-xs);
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
  }
  .linvo-bookmark-content-url:hover > span {
    color: var(--linvo-link-color);
  }
  .linvo-bookmark-content-url:hover {
    fill: var(--linvo-link-color);
  }

  .linvo-bookmark-content-url-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 12px;
    height: 20px;
  }
  .linvo-bookmark-content-url-icon {
    height: 12px;
    width: 12px;
    color: ${unsafeCSSVar('iconSecondary')};
  }

  .linvo-bookmark-banner {
    margin: 12px 12px 0px 0px;
    width: 204px;
    max-width: 100%;
    height: 102px;
  }

  .linvo-bookmark-banner img,
  .linvo-bookmark-banner object,
  .linvo-bookmark-banner svg {
    width: 204px;
    max-width: 100%;
    height: 102px;
    object-fit: cover;
    border-radius: 4px;
  }

  .linvo-bookmark-card.comment-highlighted {
    outline: 2px solid ${unsafeCSSVarV2('block/comment/highlightUnderline')};
  }

  .linvo-bookmark-card.loading {
    .linvo-bookmark-content-title-text {
      color: var(--linvo-placeholder-color);
    }
  }

  .linvo-bookmark-card.error {
    .linvo-bookmark-content-description {
      color: var(--linvo-placeholder-color);
    }
  }

  .linvo-bookmark-card.selected {
    .linvo-bookmark-content-url > span {
      color: var(--linvo-link-color);
    }
    .linvo-bookmark-content-url .linvo-bookmark-content-url-icon {
      color: var(--linvo-link-color);
    }
  }

  .linvo-bookmark-card.list {
    .linvo-bookmark-content {
      width: 100%;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    .linvo-bookmark-content-title {
      width: calc(100% - 204px);
    }

    .linvo-bookmark-content-url {
      width: 204px;
      justify-content: flex-end;
    }

    .linvo-bookmark-content-description {
      display: none;
    }

    .linvo-bookmark-banner {
      display: none;
    }
  }

  .linvo-bookmark-card.vertical {
    flex-direction: column-reverse;
    height: 100%;

    .linvo-bookmark-content {
      width: 100%;
    }

    .linvo-bookmark-content-description {
      -webkit-line-clamp: 6;
      max-height: 120px;
    }

    .linvo-bookmark-content-url-wrapper {
      max-width: fit-content;
      display: flex;
      align-items: flex-end;
      flex-grow: 1;
      cursor: pointer;
    }

    .linvo-bookmark-banner {
      width: 340px;
      height: 170px;
      margin-left: 12px;
    }

    .linvo-bookmark-banner img,
    .linvo-bookmark-banner object,
    .linvo-bookmark-banner svg {
      width: 340px;
      height: 170px;
    }
  }

  .linvo-bookmark-card.cube {
    .linvo-bookmark-content {
      width: 100%;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
    }

    .linvo-bookmark-content-title {
      flex-direction: column;
      gap: 4px;
      align-items: flex-start;
    }

    .linvo-bookmark-content-title-text {
      -webkit-line-clamp: 2;
    }

    .linvo-bookmark-content-description {
      display: none;
    }

    .linvo-bookmark-banner {
      display: none;
    }
  }

  @container linvo-bookmark-card (width < 375px) {
    .linvo-bookmark-content {
      width: 100%;
    }
    .linvo-bookmark-card:not(.edgeless) .linvo-bookmark-banner {
      display: none;
    }
  }
`;

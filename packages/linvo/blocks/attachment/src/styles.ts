import { unsafeCSSVarV2 } from '@linvo/linvo-shared/theme';
import { css } from 'lit';

export const styles = css`
  .linvo-attachment-container {
    border-radius: 8px;
    box-sizing: border-box;
    user-select: none;
    overflow: hidden;
    border: 1px solid ${unsafeCSSVarV2('layer/background/tertiary')};
    background: ${unsafeCSSVarV2('layer/background/primary')};

    &.focused {
      border-color: ${unsafeCSSVarV2('layer/insideBorder/primaryBorder')};
    }
  }

  .linvo-attachment-container.comment-highlighted {
    outline: 2px solid ${unsafeCSSVarV2('block/comment/highlightUnderline')};
  }

  .linvo-attachment-card {
    display: flex;
    gap: 12px;
    padding: 12px;
  }

  .linvo-attachment-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    flex: 1 0 0;
    min-width: 0;
  }

  .truncate {
    align-self: stretch;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .linvo-attachment-content-title {
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
    align-self: stretch;
  }

  .linvo-attachment-content-title-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--linvo-text-primary-color);
    font-size: 16px;
  }

  .linvo-attachment-content-title-text {
    color: var(--linvo-text-primary-color);
    font-family: var(--linvo-font-family);
    font-size: var(--linvo-font-sm);
    font-style: normal;
    font-weight: 600;
    line-height: 22px;
  }

  .linvo-attachment-content-description {
    display: flex;
    align-items: center;
    align-self: stretch;
    gap: 8px;
  }

  .linvo-attachment-content-info {
    color: var(--linvo-text-secondary-color);
    font-family: var(--linvo-font-family);
    font-size: var(--linvo-font-xs);
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
  }

  .linvo-attachment-content-button {
    display: flex;
    height: 20px;
    align-items: center;
    align-self: stretch;
    gap: 4px;
    white-space: nowrap;
    padding: 0 4px;
    color: ${unsafeCSSVarV2('button/primary')};
    font-family: var(--linvo-font-family);
    font-size: var(--linvo-font-xs);
    font-style: normal;
    font-weight: 500;
    text-transform: capitalize;
    line-height: 20px;

    svg {
      font-size: 16px;
    }
  }

  .linvo-attachment-banner {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .linvo-attachment-card.loading {
    .linvo-attachment-content-title-text {
      color: ${unsafeCSSVarV2('text/placeholder')};
    }
  }

  .linvo-attachment-card.error {
    .linvo-attachment-content-title-icon {
      color: ${unsafeCSSVarV2('status/error')};
    }
  }

  .linvo-attachment-card.loading,
  .linvo-attachment-card.error {
    background: ${unsafeCSSVarV2('layer/background/secondary')};
  }

  .linvo-attachment-card.cubeThick {
    flex-direction: column-reverse;

    .linvo-attachment-content {
      width: 100%;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
    }

    .linvo-attachment-banner {
      justify-content: space-between;
    }
  }

  .linvo-attachment-embed-container {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .linvo-attachment-embed-status {
    position: absolute;
    left: 14px;
    bottom: 64px;
  }

  .linvo-attachment-embed-event-mask {
    position: absolute;
    inset: 0;
  }
`;

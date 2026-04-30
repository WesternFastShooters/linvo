import { css } from '@emotion/css';
import { cssVarV2 } from '@linvo/theme/v2';

export const mobileTableViewWrapper = css({
  position: 'relative',
  width: '100%',
  paddingBottom: '4px',
  /**
   * Disable horizontal scrolling to prevent crashes on iOS Safari
   * See the upstream pull request discussion for the original sizing rationale.
   * and https://github.com/toeverything/linvo/pull/8784
   */
  overflowX: 'hidden',
  overflowY: 'hidden',
});

export const mobileTableViewContainer = css({
  position: 'relative',
  width: 'fit-content',
  minWidth: '100%',
});

export const mobileCellDivider = css({
  width: '1px',
  height: '100%',
  backgroundColor: cssVarV2.layer.insideBorder.border,
});

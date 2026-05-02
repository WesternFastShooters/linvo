import { css } from 'lit';
export const styles = css `
  .linvo-block-component.border.light .selected-style {
    border-radius: 8px;
    box-shadow: 0px 0px 0px 1px var(--linvo-brand-color);
  }
  .linvo-block-component.border.dark .selected-style {
    border-radius: 8px;
    box-shadow: 0px 0px 0px 1px var(--linvo-brand-color);
  }
  @media print {
    .linvo-block-component.border.light .selected-style,
    .linvo-block-component.border.dark .selected-style {
      box-shadow: none;
    }
  }
`;

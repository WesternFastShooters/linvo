import { css } from 'lit';

export const embedNoteContentStyles = css`
  .linvo-embed-doc-content-note-blocks linvo-divider,
  .linvo-embed-doc-content-note-blocks linvo-divider > * {
    margin-top: 0px !important;
    margin-bottom: 0px !important;
    padding-top: 8px;
    padding-bottom: 8px;
  }
  .linvo-embed-doc-content-note-blocks linvo-paragraph,
  .linvo-embed-doc-content-note-blocks linvo-list {
    margin-top: 4px !important;
    margin-bottom: 4px !important;
    padding: 0 2px;
  }
  .linvo-embed-doc-content-note-blocks linvo-paragraph *,
  .linvo-embed-doc-content-note-blocks linvo-list * {
    margin-top: 0px !important;
    margin-bottom: 0px !important;
    padding-top: 0;
    padding-bottom: 0;
    line-height: 20px;
    font-size: var(--linvo-font-xs);
    font-weight: 400;
  }
  .linvo-embed-doc-content-note-blocks linvo-list .linvo-list-block__prefix {
    height: 20px;
  }
  .linvo-embed-doc-content-note-blocks linvo-paragraph .quote {
    padding-left: 15px;
    padding-top: 8px;
    padding-bottom: 8px;
  }
  .linvo-embed-doc-content-note-blocks linvo-paragraph:has(.h1),
  .linvo-embed-doc-content-note-blocks linvo-paragraph:has(.h2),
  .linvo-embed-doc-content-note-blocks linvo-paragraph:has(.h3),
  .linvo-embed-doc-content-note-blocks linvo-paragraph:has(.h4),
  .linvo-embed-doc-content-note-blocks linvo-paragraph:has(.h5),
  .linvo-embed-doc-content-note-blocks linvo-paragraph:has(.h6) {
    margin-top: 6px !important;
    margin-bottom: 4px !important;
    padding: 0 2px;
  }
  .linvo-embed-doc-content-note-blocks linvo-paragraph:has(.h1) *,
  .linvo-embed-doc-content-note-blocks linvo-paragraph:has(.h2) *,
  .linvo-embed-doc-content-note-blocks linvo-paragraph:has(.h3) *,
  .linvo-embed-doc-content-note-blocks linvo-paragraph:has(.h4) *,
  .linvo-embed-doc-content-note-blocks linvo-paragraph:has(.h5) *,
  .linvo-embed-doc-content-note-blocks linvo-paragraph:has(.h6) * {
    margin-top: 0px !important;
    margin-bottom: 0px !important;
    padding-top: 0;
    padding-bottom: 0;
    line-height: 20px;
    font-size: var(--linvo-font-xs);
    font-weight: 600;
  }

  .linvo-embed-doc-content-note-blocks inline-comment {
    background-color: unset !important;
    border-bottom: unset !important;
  }

  .linvo-embed-linked-doc-block.horizontal {
    linvo-paragraph,
    linvo-list {
      margin-top: 0 !important;
      margin-bottom: 0 !important;
      max-height: 40px;
      overflow: hidden;
      display: flex;
    }
    linvo-paragraph .quote {
      padding-top: 4px;
      padding-bottom: 4px;
      height: 28px;
    }
    linvo-paragraph .quote::after {
      height: 20px;
      margin-top: 4px !important;
      margin-bottom: 4px !important;
    }
  }
`;

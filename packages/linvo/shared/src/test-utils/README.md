# Linvo Test Tools

## Structured Document Creation

`linvo-template.ts` provides a concise way to create test documents, using a html-like syntax.

### Basic Usage

```typescript
import { linvo } from '@linvo/linvo-shared/test-utils';

// Create a simple document
const doc = linvo`
  <linvo-page>
    <linvo-note>
      <linvo-paragraph>Hello, World!</linvo-paragraph>
    </linvo-note>
  </linvo-page>
`;
```

### Complex Structure Example

```typescript
// Create a document with multiple notes and paragraphs
const doc = linvo`
  <linvo-page title="My Test Page">
    <linvo-note>
      <linvo-paragraph>First paragraph</linvo-paragraph>
      <linvo-paragraph>Second paragraph</linvo-paragraph>
    </linvo-note>
    <linvo-note>
      <linvo-paragraph>Another note</linvo-paragraph>
    </linvo-note>
  </linvo-page>
`;
```

### Application in Tests

This tool is particularly suitable for creating documents with specific structures in test cases:

```typescript
import { describe, expect, it } from 'vitest';
import { linvo } from '../__tests__/utils/linvo-template';

describe('My Test', () => {
  it('should correctly handle document structure', () => {
    const doc = linvo`
      <linvo-page>
        <linvo-note>
          <linvo-paragraph>Test content</linvo-paragraph>
        </linvo-note>
      </linvo-page>
    `;

    // Get blocks
    const pages = doc.getBlocksByFlavour('linvo:page');
    const notes = doc.getBlocksByFlavour('linvo:note');
    const paragraphs = doc.getBlocksByFlavour('linvo:paragraph');

    expect(pages.length).toBe(1);
    expect(notes.length).toBe(1);
    expect(paragraphs.length).toBe(1);

    // Perform more tests here...
  });
});
```

### Supported Block Types

Currently supports the following block types:

- `linvo-page` → `linvo:page`
- `linvo-note` → `linvo:note`
- `linvo-paragraph` → `linvo:paragraph`
- `linvo-list` → `linvo:list`
- `linvo-image` → `linvo:image`

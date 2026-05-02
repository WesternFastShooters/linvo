import { expect, test } from 'vitest';
import * as Y from '@linvo-core/store/compat';

import { InlineEditor } from '@linvo-core/std/inline';
import { Text } from '@linvo-core/store';

test('getDeltaByRangeIndex', () => {
  const docState = new Y.Doc();
  const textState = docState.getText('text');
  textState.applyDelta([
    {
      insert: 'aaa',
      attributes: {
        bold: true,
      },
    },
    {
      insert: 'bbb',
      attributes: {
        italic: true,
      },
    },
  ]);
  const inlineEditor = new InlineEditor(new Text(textState));

  expect(inlineEditor.getDeltaByRangeIndex(0)).toEqual({
    insert: 'aaa',
    attributes: {
      bold: true,
    },
  });

  expect(inlineEditor.getDeltaByRangeIndex(1)).toEqual({
    insert: 'aaa',
    attributes: {
      bold: true,
    },
  });

  expect(inlineEditor.getDeltaByRangeIndex(3)).toEqual({
    insert: 'aaa',
    attributes: {
      bold: true,
    },
  });

  expect(inlineEditor.getDeltaByRangeIndex(4)).toEqual({
    insert: 'bbb',
    attributes: {
      italic: true,
    },
  });
});

test('getDeltasByInlineRange', () => {
  const docState = new Y.Doc();
  const textState = docState.getText('text');
  textState.applyDelta([
    {
      insert: 'aaa',
      attributes: {
        bold: true,
      },
    },
    {
      insert: 'bbb',
      attributes: {
        italic: true,
      },
    },
    {
      insert: 'ccc',
      attributes: {
        underline: true,
      },
    },
  ]);
  const inlineEditor = new InlineEditor(new Text(textState));

  expect(
    inlineEditor.getDeltasByInlineRange({
      index: 0,
      length: 0,
    })
  ).toEqual([
    [
      {
        insert: 'aaa',
        attributes: {
          bold: true,
        },
      },
      {
        index: 0,
        length: 3,
      },
    ],
  ]);

  expect(
    inlineEditor.getDeltasByInlineRange({
      index: 0,
      length: 1,
    })
  ).toEqual([
    [
      {
        insert: 'aaa',
        attributes: {
          bold: true,
        },
      },
      {
        index: 0,
        length: 3,
      },
    ],
  ]);

  expect(
    inlineEditor.getDeltasByInlineRange({
      index: 0,
      length: 3,
    })
  ).toEqual([
    [
      {
        insert: 'aaa',
        attributes: {
          bold: true,
        },
      },
      {
        index: 0,
        length: 3,
      },
    ],
  ]);

  expect(
    inlineEditor.getDeltasByInlineRange({
      index: 0,
      length: 4,
    })
  ).toEqual([
    [
      {
        insert: 'aaa',
        attributes: {
          bold: true,
        },
      },
      {
        index: 0,
        length: 3,
      },
    ],
    [
      {
        insert: 'bbb',
        attributes: {
          italic: true,
        },
      },
      {
        index: 3,
        length: 3,
      },
    ],
  ]);

  expect(
    inlineEditor.getDeltasByInlineRange({
      index: 3,
      length: 1,
    })
  ).toEqual([
    [
      {
        insert: 'aaa',
        attributes: {
          bold: true,
        },
      },
      {
        index: 0,
        length: 3,
      },
    ],
    [
      {
        insert: 'bbb',
        attributes: {
          italic: true,
        },
      },
      {
        index: 3,
        length: 3,
      },
    ],
  ]);

  expect(
    inlineEditor.getDeltasByInlineRange({
      index: 3,
      length: 3,
    })
  ).toEqual([
    [
      {
        insert: 'aaa',
        attributes: {
          bold: true,
        },
      },
      {
        index: 0,
        length: 3,
      },
    ],
    [
      {
        insert: 'bbb',
        attributes: {
          italic: true,
        },
      },
      {
        index: 3,
        length: 3,
      },
    ],
  ]);

  expect(
    inlineEditor.getDeltasByInlineRange({
      index: 3,
      length: 4,
    })
  ).toEqual([
    [
      {
        insert: 'aaa',
        attributes: {
          bold: true,
        },
      },
      {
        index: 0,
        length: 3,
      },
    ],
    [
      {
        insert: 'bbb',
        attributes: {
          italic: true,
        },
      },
      {
        index: 3,
        length: 3,
      },
    ],
    [
      {
        insert: 'ccc',
        attributes: {
          underline: true,
        },
      },
      {
        index: 6,
        length: 3,
      },
    ],
  ]);

  expect(
    inlineEditor.getDeltasByInlineRange({
      index: 4,
      length: 0,
    })
  ).toEqual([
    [
      {
        insert: 'bbb',
        attributes: {
          italic: true,
        },
      },
      {
        index: 3,
        length: 3,
      },
    ],
  ]);

  expect(
    inlineEditor.getDeltasByInlineRange({
      index: 4,
      length: 1,
    })
  ).toEqual([
    [
      {
        insert: 'bbb',
        attributes: {
          italic: true,
        },
      },
      {
        index: 3,
        length: 3,
      },
    ],
  ]);

  expect(
    inlineEditor.getDeltasByInlineRange({
      index: 4,
      length: 2,
    })
  ).toEqual([
    [
      {
        insert: 'bbb',
        attributes: {
          italic: true,
        },
      },
      {
        index: 3,
        length: 3,
      },
    ],
  ]);

  expect(
    inlineEditor.getDeltasByInlineRange({
      index: 4,
      length: 4,
    })
  ).toEqual([
    [
      {
        insert: 'bbb',
        attributes: {
          italic: true,
        },
      },
      {
        index: 3,
        length: 3,
      },
    ],
    [
      {
        insert: 'ccc',
        attributes: {
          underline: true,
        },
      },
      {
        index: 6,
        length: 3,
      },
    ],
  ]);
});

test('cursor with format', () => {
  const docState = new Y.Doc();
  const textState = docState.getText('text');
  const inlineEditor = new InlineEditor(new Text(textState));

  inlineEditor.insertText(
    {
      index: 0,
      length: 0,
    },
    'aaa',
    {
      bold: true,
    }
  );

  inlineEditor.setMarks({
    italic: true,
  });

  inlineEditor.insertText(
    {
      index: 3,
      length: 0,
    },
    'bbb'
  );

  expect(inlineEditor.yText.toDelta()).toEqual([
    {
      insert: 'aaa',
      attributes: {
        bold: true,
      },
    },
    {
      insert: 'bbb',
      attributes: {
        italic: true,
      },
    },
  ]);
});

test('getFormat', () => {
  const docState = new Y.Doc();
  const textState = docState.getText('text');
  const inlineEditor = new InlineEditor(new Text(textState));

  inlineEditor.insertText(
    {
      index: 0,
      length: 0,
    },
    'aaa',
    {
      bold: true,
    }
  );

  inlineEditor.insertText(
    {
      index: 3,
      length: 0,
    },
    'bbb',
    {
      italic: true,
    }
  );

  expect(inlineEditor.getFormat({ index: 0, length: 0 })).toEqual({});

  expect(inlineEditor.getFormat({ index: 0, length: 1 })).toEqual({
    bold: true,
  });

  expect(inlineEditor.getFormat({ index: 0, length: 3 })).toEqual({
    bold: true,
  });

  expect(inlineEditor.getFormat({ index: 3, length: 0 })).toEqual({
    bold: true,
  });

  expect(inlineEditor.getFormat({ index: 3, length: 1 })).toEqual({
    italic: true,
  });

  expect(inlineEditor.getFormat({ index: 3, length: 3 })).toEqual({
    italic: true,
  });

  expect(inlineEditor.getFormat({ index: 6, length: 0 })).toEqual({
    italic: true,
  });
});

test('incorrect format value `false`', () => {
  const docState = new Y.Doc();
  const textState = docState.getText('text');
  const inlineEditor = new InlineEditor(new Text(textState));

  inlineEditor.insertText(
    {
      index: 0,
      length: 0,
    },
    'aaa',
    {
      // @ts-expect-error insert incorrect value
      bold: false,
      italic: true,
    }
  );

  inlineEditor.insertText(
    {
      index: 3,
      length: 0,
    },
    'bbb',
    {
      underline: true,
    }
  );

  expect(inlineEditor.yText.toDelta()).toEqual([
    {
      insert: 'aaa',
      attributes: {
        italic: true,
      },
    },
    {
      insert: 'bbb',
      attributes: {
        underline: true,
      },
    },
  ]);
});

test('yText should not contain \r', () => {
  const docState = new Y.Doc();
  const textState = docState.getText('text');
  textState.insert(0, 'aaa\r');

  expect(textState.toString()).toEqual('aaa\r');
  expect(() => {
    new InlineEditor(new Text(textState));
  }).toThrow(
    'yText must not contain "\\r" because it will break the range synchronization'
  );
});

/**
 * @vitest-environment happy-dom
 */
import { describe, expect, it } from 'vitest';

import { getLastBlockCommand } from '../../../commands/block-crud/get-last-content-block';
import { linvo } from '../../../test-utils';

describe('commands/block-crud', () => {
  describe('getLastBlockCommand', () => {
    it('should return null when root is not exists', () => {
      const host = linvo`<linvo-page></linvo-page>`;

      const [_, { lastBlock }] = host.command.exec(getLastBlockCommand, {
        role: 'content',
        root: undefined,
      });

      expect(lastBlock).toBeNull();
    });

    it('should return last block with content role when found', () => {
      const host = linvo`
        <linvo-page>
          <linvo-note id="note-1">
            <linvo-paragraph id="paragraph-1-1">First Paragraph</linvo-paragraph>
            <linvo-paragraph id="paragraph-1-2">Second Paragraph</linvo-paragraph>
          </linvo-note>
          <linvo-note id="note-2">
            <linvo-paragraph id="paragraph-2-1">First Paragraph</linvo-paragraph>
            <linvo-paragraph id="paragraph-2-2">Second Paragraph</linvo-paragraph>
          </linvo-note>
        </linvo-page>
      `;

      const [_, { lastBlock }] = host.command.exec(getLastBlockCommand, {
        role: 'hub',
        root: undefined,
      });

      expect(lastBlock?.id).toBe('note-2');
    });

    it('should return last block with any role in the array when found', () => {
      const host = linvo`
        <linvo-page>
          <linvo-note id="note-1">
            <linvo-paragraph id="paragraph-1-1">First Paragraph</linvo-paragraph>
            <linvo-paragraph id="paragraph-1-2">Second Paragraph</linvo-paragraph>
          </linvo-note>
          <linvo-note id="note-2">
            <linvo-paragraph id="paragraph-2-1">First Paragraph</linvo-paragraph>
            <linvo-paragraph id="paragraph-2-2">Second Paragraph</linvo-paragraph>
          </linvo-note>
        </linvo-page>
      `;

      const [_, { lastBlock }] = host.command.exec(getLastBlockCommand, {
        role: ['hub', 'content'],
        root: undefined,
      });

      expect(lastBlock?.id).toBe('note-2');
    });

    it('should return last block with specified flavour when found', () => {
      const host = linvo`
        <linvo-page>
          <linvo-note id="note-1">
            <linvo-paragraph id="paragraph-1">Paragraph</linvo-paragraph>
            <linvo-list id="list-1">List Item</linvo-list>
          </linvo-note>
        </linvo-page>
      `;

      const note = host.store.getBlock('note-1')?.model;

      const [_, { lastBlock }] = host.command.exec(getLastBlockCommand, {
        flavour: 'linvo:list',
        root: note,
      });

      expect(lastBlock?.id).toBe('list-1');
    });

    it('should return last block with any flavour in the array when found', () => {
      const host = linvo`
        <linvo-page>
          <linvo-note id="note-1">
            <linvo-paragraph id="paragraph-1">Paragraph</linvo-paragraph>
            <linvo-list id="list-1">List Item</linvo-list>
          </linvo-note>
        </linvo-page>
      `;

      const note = host.store.getBlock('note-1')?.model;

      const [_, { lastBlock }] = host.command.exec(getLastBlockCommand, {
        flavour: ['linvo:list', 'linvo:code'],
        root: note,
      });

      expect(lastBlock?.id).toBe('list-1');
    });

    it('should return last block matching both role and flavour when both specified', () => {
      const host = linvo`
        <linvo-page>
          <linvo-note id="note-1">
            <linvo-paragraph id="paragraph-1">Content Paragraph</linvo-paragraph>
            <linvo-list id="list-1">Content List</linvo-list>
            <linvo-paragraph id="paragraph-2">hub Paragraph</linvo-paragraph>
          </linvo-note>
        </linvo-page>
      `;

      const note = host.store.getBlock('note-1')?.model;
      const [_, { lastBlock }] = host.command.exec(getLastBlockCommand, {
        role: 'content',
        flavour: 'linvo:list',
        root: note,
      });

      expect(lastBlock?.id).toBe('list-1');
    });

    it('should return last block with default roles when role not specified', () => {
      const host = linvo`
        <linvo-page>
          <linvo-note id="note-1">
            <linvo-paragraph id="paragraph-1">hub Paragraph</linvo-paragraph>
            <linvo-paragraph id="paragraph-2">Content Paragraph</linvo-paragraph>
            <linvo-paragraph id="paragraph-3">Hub Paragraph</linvo-paragraph>
          </linvo-note>
        </linvo-page>
      `;

      const [_, { lastBlock }] = host.command.exec(getLastBlockCommand, {
        root: undefined,
      });

      expect(lastBlock?.id).toBe('note-1');
    });

    it('should return last block with specified role when found', () => {
      const host = linvo`
        <linvo-page>
          <linvo-note id="note-1">
            <linvo-paragraph id="paragraph-1">Content Paragraph</linvo-paragraph>
            <linvo-paragraph id="paragraph-2">hub Paragraph</linvo-paragraph>
            <linvo-database id="database-1">Database</linvo-database>
          </linvo-note>
        </linvo-page>
      `;

      const note = host.store.getBlock('note-1')?.model;

      const [_, { lastBlock }] = host.command.exec(getLastBlockCommand, {
        role: 'hub',
        root: note,
      });

      expect(lastBlock?.id).toBe('database-1');
    });

    it('should return null when no blocks with specified role are found in children', () => {
      const host = linvo`
        <linvo-page>
          <linvo-note id="note-1">
            <linvo-paragraph id="paragraph-1">Content Paragraph</linvo-paragraph>
            <linvo-paragraph id="paragraph-2">Another Content Paragraph</linvo-paragraph>
          </linvo-note>
        </linvo-page>
      `;

      const note = host.store.getBlock('note-1')?.model;

      const [_, { lastBlock }] = host.command.exec(getLastBlockCommand, {
        role: 'hub',
        root: note,
      });

      expect(lastBlock).toBeNull();
    });

    it('should return null when no blocks with specified flavour are found in children', () => {
      const host = linvo`
        <linvo-page>
          <linvo-note id="note-1">
            <linvo-paragraph id="paragraph-1">Paragraph</linvo-paragraph>
            <linvo-paragraph id="paragraph-2">Another Paragraph</linvo-paragraph>
          </linvo-note>
        </linvo-page>
      `;

      const note = host.store.getBlock('note-1')?.model;

      const [_, { lastBlock }] = host.command.exec(getLastBlockCommand, {
        flavour: 'linvo:list',
        root: note,
      });

      expect(lastBlock).toBeNull();
    });

    it('should return last block with specified role within specified root subtree', () => {
      const host = linvo`
        <linvo-page>
          <linvo-note id="note-1">
            <linvo-paragraph id="paragraph-1-1">1-1 Content</linvo-paragraph>
            <linvo-paragraph id="paragraph-1-2">1-2 hub</linvo-paragraph>
          </linvo-note>
          <linvo-note id="note-2">
            <linvo-paragraph id="paragraph-2-1">2-1 hub</linvo-paragraph>
            <linvo-paragraph id="paragraph-2-2">2-2 Content</linvo-paragraph>
          </linvo-note>
        </linvo-page>
      `;

      const note = host.store.getBlock('note-2')?.model;

      const [_, { lastBlock }] = host.command.exec(getLastBlockCommand, {
        role: 'content',
        root: note,
      });

      expect(lastBlock?.id).toBe('paragraph-2-2');
    });
  });
});

import { BlockViewExtension, FlavourExtension } from '@linvo/std';
import type { ExtensionType } from '@linvo/store';
import { literal } from 'lit/static-html.js';

export const DataViewBlockSpec: ExtensionType[] = [
  FlavourExtension('linvo:data-view'),
  BlockViewExtension('linvo:data-view', literal`linvo-data-view`),
];

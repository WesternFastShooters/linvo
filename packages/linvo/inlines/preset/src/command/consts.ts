// corresponding to `formatText` command
import { TableModelFlavour } from '@linvo/linvo-model';

export const FORMAT_TEXT_SUPPORT_FLAVOURS = [
  'linvo:paragraph',
  'linvo:list',
  'linvo:code',
];
// corresponding to `formatBlock` command
export const FORMAT_BLOCK_SUPPORT_FLAVOURS = [
  'linvo:paragraph',
  'linvo:list',
  'linvo:code',
];
// corresponding to `formatNative` command
export const FORMAT_NATIVE_SUPPORT_FLAVOURS = [
  'linvo:database',
  TableModelFlavour,
];

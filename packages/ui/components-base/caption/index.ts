import { defineCustomElement } from '@linvo-core/global/utils';
import { BlockCaptionEditor } from './block-caption';
export { BlockCaptionEditor, type BlockCaptionProps } from './block-caption';
export {
  CaptionedBlockComponent,
  SelectedStyle,
} from './captioned-block-component';

export function effects() {
  defineCustomElement('block-caption-editor', BlockCaptionEditor);
}

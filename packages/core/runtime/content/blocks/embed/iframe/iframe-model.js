import { GfxCompatible, } from '@linvo-core/std/gfx';
import { BlockModel } from '@linvo-core/store';
import {} from '../../../helpers';
export const EmbedIframeStyles = ['figma'];
export const defaultEmbedIframeProps = {
    url: '',
    iframeUrl: '',
    width: undefined,
    height: undefined,
    caption: null,
    title: null,
    description: null,
    xywh: '[0,0,0,0]',
    index: 'a0',
    lockedBySelf: false,
    scale: 1,
};
export class EmbedIframeBlockModel extends GfxCompatible(BlockModel) {
}

import type { GfxCommonBlockProps, GfxElementGeometry } from '@linvo-core/std/gfx';
import type { BlockMeta } from '../../helpers/types';
import { ImageBlockTransformer } from './image-transformer';
export type ImageBlockProps = {
    caption?: string;
    sourceId?: string;
    width?: number;
    height?: number;
    rotate: number;
    size?: number;
    comments?: Record<string, boolean>;
} & Omit<GfxCommonBlockProps, 'scale'> & BlockMeta;
export declare const ImageBlockSchema: {
    version: number;
    model: {
        props: import("@linvo-core/store").PropsGetter<ImageBlockProps>;
        flavour: "linvo:image";
    } & {
        version: number;
        role: "content";
    };
    transformer?: ((transformerConfig: Map<string, unknown>) => ImageBlockTransformer) | undefined;
};
export declare const ImageBlockSchemaExtension: import("@linvo-core/composition").ExtensionType;
declare const ImageBlockModel_base: {
    new (): import("@linvo-core/std/gfx").GfxBlockElementModel<ImageBlockProps>;
};
export declare class ImageBlockModel extends ImageBlockModel_base implements GfxElementGeometry {
}
export {};

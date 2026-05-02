import { GfxCompatible } from '@linvo-core/std/gfx';
import { defineBlockSchema, } from '@linvo-core/store';
export function defineEmbedModel(BlockModelSuperClass) {
    return GfxCompatible(BlockModelSuperClass);
}
export function createEmbedBlockSchema({ name, version, toModel, props, transformer, }) {
    return defineBlockSchema({
        flavour: `linvo:embed-${name}`,
        props: internalPrimitives => {
            const userProps = props?.(internalPrimitives);
            return {
                index: 'a0',
                xywh: '[0,0,0,0]',
                lockedBySelf: false,
                rotate: 0,
                comments: undefined,
                'meta:createdAt': undefined,
                'meta:updatedAt': undefined,
                'meta:createdBy': undefined,
                'meta:updatedBy': undefined,
                ...userProps,
            };
        },
        metadata: {
            version,
            role: 'content',
        },
        toModel,
        transformer,
    });
}

import { GfxCompatible } from '@linvo-core/std/gfx';
import { BlockModel, BlockSchemaExtension, defineBlockSchema, } from '@linvo-core/store';
import { AttachmentBlockTransformer } from './attachment-transformer';
export const AttachmentBlockStyles = [
    'cubeThick',
    'horizontalThin',
    'pdf',
    'citation',
];
export const defaultAttachmentProps = {
    name: '',
    size: 0,
    type: 'application/octet-stream',
    sourceId: undefined,
    caption: undefined,
    embed: false,
    style: AttachmentBlockStyles[1],
    index: 'a0',
    xywh: '[0,0,0,0]',
    lockedBySelf: false,
    rotate: 0,
    'meta:createdAt': undefined,
    'meta:updatedAt': undefined,
    'meta:createdBy': undefined,
    'meta:updatedBy': undefined,
    footnoteIdentifier: null,
    comments: undefined,
};
export const AttachmentBlockSchema = defineBlockSchema({
    flavour: 'linvo:attachment',
    props: () => defaultAttachmentProps,
    metadata: {
        version: 1,
        role: 'content',
        parent: [
            'linvo:note',
            'linvo:surface',
            'linvo:paragraph',
            'linvo:list',
        ],
        children: ['@attachment-viewer'],
    },
    transformer: transformerConfigs => new AttachmentBlockTransformer(transformerConfigs),
    toModel: () => new AttachmentBlockModel(),
});
export const AttachmentBlockSchemaExtension = BlockSchemaExtension(AttachmentBlockSchema);
export class AttachmentBlockModel extends GfxCompatible(BlockModel) {
}

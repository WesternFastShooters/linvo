import { Bound } from '@linvo-core/global/gfx';
import { GfxCompatible } from '@linvo-core/std/gfx';
import { BlockModel, BlockSchemaExtension, defineBlockSchema, } from '@linvo-core/store';
import { z } from 'zod';
import { DEFAULT_NOTE_BORDER_SIZE, DEFAULT_NOTE_BORDER_STYLE, DEFAULT_NOTE_CORNER, DEFAULT_NOTE_HEIGHT, DEFAULT_NOTE_SHADOW, DEFAULT_NOTE_WIDTH, NoteDisplayMode, NoteDisplayModeSchema, NoteShadowsSchema, StrokeStyleSchema, } from '../../definitions/note';
import { ColorSchema, DefaultTheme } from '../../theme';
export const NoteZodSchema = z
    .object({
    background: ColorSchema,
    displayMode: NoteDisplayModeSchema,
    text: z.string(),
    edgeless: z.object({
        style: z.object({
            borderRadius: z.number(),
            borderSize: z.number(),
            borderStyle: StrokeStyleSchema,
            shadowType: NoteShadowsSchema,
        }),
    }),
})
    .default({
    background: DefaultTheme.noteBackgrounColor,
    displayMode: NoteDisplayMode.EdgelessOnly,
    text: '',
    edgeless: {
        style: {
            borderRadius: DEFAULT_NOTE_CORNER,
            borderSize: DEFAULT_NOTE_BORDER_SIZE,
            borderStyle: DEFAULT_NOTE_BORDER_STYLE,
            shadowType: DEFAULT_NOTE_SHADOW,
        },
    },
});
export const NoteBlockSchema = defineBlockSchema({
    flavour: 'linvo:note',
    props: () => ({
        xywh: `[0,0,${DEFAULT_NOTE_WIDTH},${DEFAULT_NOTE_HEIGHT}]`,
        background: DefaultTheme.noteBackgrounColor,
        index: 'a0',
        lockedBySelf: false,
        hidden: false,
        displayMode: NoteDisplayMode.DocAndEdgeless,
        text: '',
        edgeless: {
            style: {
                borderRadius: DEFAULT_NOTE_CORNER,
                borderSize: DEFAULT_NOTE_BORDER_SIZE,
                borderStyle: DEFAULT_NOTE_BORDER_STYLE,
                shadowType: DEFAULT_NOTE_SHADOW,
            },
        },
        comments: undefined,
    }),
    metadata: {
        version: 1,
        role: 'hub',
        parent: ['@root'],
        children: [
            '@content',
            'linvo:database',
            'linvo:data-view',
            'linvo:callout',
        ],
    },
    toModel: () => {
        return new NoteBlockModel();
    },
});
export const NoteBlockSchemaExtension = BlockSchemaExtension(NoteBlockSchema);
export class NoteBlockModel extends GfxCompatible(BlockModel) {
    _isSelectable() {
        return this.props.displayMode !== NoteDisplayMode.DocOnly;
    }
    containsBound(bounds) {
        if (!this._isSelectable())
            return false;
        return super.containsBound(bounds);
    }
    includesPoint(x, y) {
        if (!this._isSelectable())
            return false;
        const bound = Bound.deserialize(this.xywh);
        return bound.isPointInBound([x, y], 0);
    }
    intersectsBound(bound) {
        if (!this._isSelectable())
            return false;
        return super.intersectsBound(bound);
    }
    isEmpty() {
        if (this.props.text.trim().length > 0)
            return false;
        if (this.children.length === 0)
            return true;
        if (this.children.length === 1) {
            const firstChild = this.children[0];
            if (firstChild.flavour === 'linvo:paragraph') {
                return firstChild.isEmpty();
            }
        }
        return false;
    }
    /**
     * We define a note block as a page block if it is the first visible note
     */
    isPageBlock() {
        return (this.parent?.children.find(child => child instanceof NoteBlockModel &&
            child.props.displayMode !== NoteDisplayMode.EdgelessOnly) === this);
    }
}

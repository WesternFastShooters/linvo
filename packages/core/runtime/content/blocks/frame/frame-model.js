var _a;
import { Bound } from '@linvo-core/global/gfx';
import { canSafeAddToContainer, descendantElementsImpl, generateKeyBetweenV2, GfxCompatible, gfxGroupCompatibleSymbol, hasDescendantElementImpl, } from '@linvo-core/std/gfx';
import { BlockModel, BlockSchemaExtension, defineBlockSchema, } from '@linvo-core/store';
import { z } from 'zod';
import { ColorSchema, DefaultTheme } from '../../theme';
export const FrameZodSchema = z
    .object({
    background: ColorSchema,
})
    .default({
    background: DefaultTheme.transparent,
});
export const FrameBlockSchema = defineBlockSchema({
    flavour: 'linvo:frame',
    props: (internal) => ({
        title: internal.Text(),
        background: 'transparent',
        xywh: `[0,0,100,100]`,
        index: 'a0',
        childElementIds: Object.create(null),
        presentationIndex: generateKeyBetweenV2(null, null),
        lockedBySelf: false,
        comments: undefined,
    }),
    metadata: {
        version: 1,
        role: 'content',
        parent: ['linvo:surface'],
        children: [],
    },
    toModel: () => {
        return new FrameBlockModel();
    },
});
export const FrameBlockSchemaExtension = BlockSchemaExtension(FrameBlockSchema);
export class FrameBlockModel extends GfxCompatible(BlockModel) {
    constructor() {
        super(...arguments);
        this[_a] = true;
    }
    static { _a = gfxGroupCompatibleSymbol; }
    get childElements() {
        if (!this.surface)
            return [];
        const elements = [];
        for (const key of this.childIds) {
            const element = this.surface.getElementById(key) ||
                this.surface.store.getModelById(key);
            element && elements.push(element);
        }
        return elements;
    }
    get childIds() {
        return this.props.childElementIds
            ? Object.keys(this.props.childElementIds)
            : [];
    }
    get descendantElements() {
        return descendantElementsImpl(this);
    }
    addChild(element) {
        if (!canSafeAddToContainer(this, element))
            return;
        this.store.transact(() => {
            this.props.childElementIds = {
                ...this.props.childElementIds,
                [element.id]: true,
            };
        });
    }
    addChildren(elements) {
        elements = [...new Set(elements)].filter(element => canSafeAddToContainer(this, element));
        const newChildren = {};
        for (const element of elements) {
            const id = typeof element === 'string' ? element : element.id;
            newChildren[id] = true;
        }
        this.store.transact(() => {
            this.props.childElementIds = {
                ...this.props.childElementIds,
                ...newChildren,
            };
        });
    }
    containsBound(bound) {
        return this.elementBound.contains(bound);
    }
    hasChild(element) {
        return this.props.childElementIds
            ? element.id in this.props.childElementIds
            : false;
    }
    hasDescendant(element) {
        return hasDescendantElementImpl(this, element);
    }
    includesPoint(x, y, _) {
        const bound = Bound.deserialize(this.xywh);
        return bound.isPointInBound([x, y]);
    }
    intersectsBound(selectedBound) {
        const bound = Bound.deserialize(this.xywh);
        return (bound.isIntersectWithBound(selectedBound) || selectedBound.contains(bound));
    }
    removeChild(element) {
        this.store.transact(() => {
            this.props.childElementIds &&
                delete this.props.childElementIds[element.id];
        });
    }
}

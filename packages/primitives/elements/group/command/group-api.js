import { EdgelessCRUDIdentifier } from '@linvo-core/block-surface';
import { MindmapElementModel, } from '@linvo-core/content';
import { GfxControllerIdentifier } from '@linvo-core/std/gfx';
export const createGroupCommand = (ctx, next) => {
    const { std, elements } = ctx;
    const gfx = std.get(GfxControllerIdentifier);
    const crud = std.get(EdgelessCRUDIdentifier);
    const groups = gfx.layer.canvasElements.filter(el => el.type === 'group');
    const groupId = crud.addElement('group', {
        children: elements.reduce((pre, el) => {
            const id = typeof el === 'string' ? el : el.id;
            pre[id] = true;
            return pre;
        }, {}),
        title: `Group ${groups.length + 1}`,
    });
    if (!groupId) {
        return;
    }
    next({ groupId });
};
export const createGroupFromSelectedCommand = (ctx, next) => {
    const { std } = ctx;
    const gfx = std.get(GfxControllerIdentifier);
    const { selection, surface } = gfx;
    if (!surface) {
        return;
    }
    if (selection.selectedElements.length === 0 ||
        !selection.selectedElements.every(element => element.group === selection.firstElement.group &&
            !(element.group instanceof MindmapElementModel))) {
        return;
    }
    const parent = selection.firstElement.group;
    if (parent !== null) {
        selection.selectedElements.forEach(element => {
            // oxlint-disable-next-line unicorn/prefer-dom-node-remove
            parent.removeChild(element);
        });
    }
    const [_, result] = std.command.exec(createGroupCommand, {
        elements: selection.selectedElements,
    });
    if (!result.groupId) {
        return;
    }
    const group = surface.getElementById(result.groupId);
    if (parent !== null && group) {
        parent.addChild(group);
    }
    selection.set({
        editing: false,
        elements: [result.groupId],
    });
    next({ groupId: result.groupId });
};
export const ungroupCommand = (ctx, next) => {
    const { std, group } = ctx;
    const gfx = std.get(GfxControllerIdentifier);
    const { selection } = gfx;
    const parent = group.group;
    const elements = group.childElements;
    if (group instanceof MindmapElementModel) {
        return;
    }
    if (parent !== null) {
        // oxlint-disable-next-line unicorn/prefer-dom-node-remove
        parent.removeChild(group);
    }
    elements.forEach(element => {
        // oxlint-disable-next-line unicorn/prefer-dom-node-remove
        group.removeChild(element);
    });
    // keep relative index order of group children after ungroup
    elements
        .sort((a, b) => gfx.layer.compare(a, b))
        .forEach(element => {
        std.store.transact(() => {
            element.index = gfx.layer.generateIndex();
        });
    });
    if (parent !== null) {
        elements.forEach(element => {
            parent.addChild(element);
        });
    }
    selection.set({
        editing: false,
        elements: elements.map(ele => ele.id),
    });
    next();
};

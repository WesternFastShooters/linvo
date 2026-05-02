import { type GroupElementModel } from '@linvo-core/content';
import type { Command } from '@linvo-core/std';
import { type GfxModel } from '@linvo-core/std/gfx';
export declare const createGroupCommand: Command<{
    elements: GfxModel[] | string[];
}, {
    groupId: string;
}>;
export declare const createGroupFromSelectedCommand: Command<{}, {
    groupId: string;
}>;
export declare const ungroupCommand: Command<{
    group: GroupElementModel;
}, {}>;

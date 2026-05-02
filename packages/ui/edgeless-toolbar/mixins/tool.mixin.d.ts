import type { ColorScheme } from '@linvo-core/content';
import { type DisposableClass } from '@linvo-core/global/lit';
import type { Constructor } from '@linvo-core/global/utils';
import type { BlockComponent } from '@linvo-core/std';
import { type GfxController, type ToolController, type ToolOptionWithType, type ToolType } from '@linvo-core/std/gfx';
import type { LitElement } from 'lit';
import { type EdgelessToolbarSlots } from '../context';
import { createPopper, type MenuPopper } from '../create-popper';
import type { EdgelessToolbarWidget } from '../edgeless-toolbar';
export declare abstract class EdgelessToolbarToolClass extends DisposableClass {
    active: boolean;
    createPopper: typeof createPopper;
    edgeless: BlockComponent;
    edgelessTool: ToolOptionWithType;
    enableActiveBackground?: boolean;
    popper: MenuPopper<HTMLElement> | null;
    setEdgelessTool: ToolController['setTool'];
    gfx: GfxController;
    theme: ColorScheme;
    toolbarContainer: HTMLElement | null;
    toolbarSlots: EdgelessToolbarSlots;
    /**
     * @return true if operation was successful
     */
    tryDisposePopper: () => boolean;
    abstract type: ToolType | ToolType[];
    accessor toolbar: EdgelessToolbarWidget;
}
export declare const EdgelessToolbarToolMixin: <T extends Constructor<LitElement>>(SuperClass: T) => T & Constructor<EdgelessToolbarToolClass>;

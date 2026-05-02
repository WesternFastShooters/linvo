import type { MenuConfig } from '@linvo-ui/components/context-menu';
import type { BlockComponent } from '@linvo-core/std';
import type { GfxController } from '@linvo-core/std/gfx';
import type { ExtensionType } from '@linvo-core/store';
import { type TemplateResult } from 'lit';
export interface QuickTool {
    type?: string;
    enable?: boolean;
    content: TemplateResult;
    /**
     * if not configured, the tool will not be shown in dense mode
     */
    menu?: MenuConfig;
    priority?: number;
}
export interface SeniorTool {
    /**
     * Used to show in nav-button's tooltip
     */
    name: string;
    content: TemplateResult;
    enable?: boolean;
}
export type ToolBuilder<T> = (options: {
    block: BlockComponent;
    gfx: GfxController;
    toolbarContainer: HTMLElement;
}) => T;
export declare const QuickToolIdentifier: import("@linvo-core/composition/di").ServiceIdentifier<ToolBuilder<QuickTool>> & (<U extends ToolBuilder<QuickTool> = ToolBuilder<QuickTool>>(variant: import("@linvo-core/composition/di").ServiceVariant) => import("@linvo-core/composition/di").ServiceIdentifier<U>);
export declare const SeniorToolIdentifier: import("@linvo-core/composition/di").ServiceIdentifier<ToolBuilder<SeniorTool>> & (<U extends ToolBuilder<SeniorTool> = ToolBuilder<SeniorTool>>(variant: import("@linvo-core/composition/di").ServiceVariant) => import("@linvo-core/composition/di").ServiceIdentifier<U>);
export declare const QuickToolExtension: (id: string, builder: ToolBuilder<QuickTool>) => ExtensionType;
export declare const SeniorToolExtension: (id: string, builder: ToolBuilder<SeniorTool>) => ExtensionType;

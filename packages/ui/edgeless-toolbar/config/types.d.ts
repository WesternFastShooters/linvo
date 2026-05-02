import type { MenuConfig } from '@linvo-ui/components/context-menu';
import type { BlockComponent } from '@linvo-core/std';
import type { GfxController } from '@linvo-core/std/gfx';
import type { TemplateResult } from 'lit';
export type MenuItem<T> = {
    key?: string;
    value: T;
    icon?: TemplateResult;
    disabled?: boolean;
};
export type Menu<T> = {
    label: string;
    icon?: TemplateResult;
    tooltip?: string;
    items: MenuItem<T>[];
    currentValue: T;
    onPick: (value: T) => void;
};
/**
 * Helper function to build a menu configuration for a tool in dense mode
 */
export type DenseMenuBuilder = (edgeless: BlockComponent, gfx: GfxController) => MenuConfig;

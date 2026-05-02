import { type TemplateResult } from 'lit';
import type { MenuConfig } from './menu';
export declare const menuDynamicItems: {
    dynamic: (config: () => MenuConfig[]) => (menu: import("./menu").Menu) => TemplateResult | undefined;
};

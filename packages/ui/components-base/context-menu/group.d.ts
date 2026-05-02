import { type TemplateResult } from 'lit';
import type { MenuConfig } from './menu';
export declare const menuGroupItems: {
    group: (config: {
        name?: string;
        items: MenuConfig[];
    }) => (menu: import("./menu").Menu, index: number) => TemplateResult | undefined;
};

import { ShadowlessElement } from '@linvo-core/std';
import type { Menu } from './menu';
declare const MenuItem_base: typeof ShadowlessElement & import("@linvo-core/global/utils").Constructor<import("@linvo-core/global/lit").DisposableClass>;
export declare abstract class MenuItem extends MenuItem_base {
    accessor menu: Menu;
}
export {};

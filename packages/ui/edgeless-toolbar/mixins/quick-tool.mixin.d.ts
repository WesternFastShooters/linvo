import type { Constructor } from '@linvo-core/global/utils';
import type { LitElement } from 'lit';
import { type EdgelessToolbarToolClass } from './tool.mixin';
export declare abstract class QuickToolMixinClass extends EdgelessToolbarToolClass {
}
/**
 * Mixin for quick tool item.
 */
export declare const QuickToolMixin: <T extends Constructor<LitElement>>(SuperClass: T) => T & Constructor<QuickToolMixinClass>;

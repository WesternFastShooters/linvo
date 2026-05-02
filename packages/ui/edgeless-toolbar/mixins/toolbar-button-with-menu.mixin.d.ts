import type { Constructor } from '@linvo-core/global/utils';
import type { LitElement } from 'lit';
import { type EdgelessToolbarToolClass } from './tool.mixin';
export declare abstract class ToolbarButtonWithMenuClass extends EdgelessToolbarToolClass {
}
export declare const ToolbarButtonWithMenuMixin: <T extends Constructor<LitElement> = Constructor<LitElement>>(SuperClass: T) => T & Constructor<ToolbarButtonWithMenuClass>;

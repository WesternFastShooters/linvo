import { EdgelessToolbarToolMixin, } from './tool.mixin';
export const ToolbarButtonWithMenuMixin = (SuperClass) => {
    class DerivedClass extends EdgelessToolbarToolMixin(SuperClass) {
    }
    return DerivedClass;
};

import type { ShapeToolOption } from '@linvo-primitives/shape';
import type { TemplateResult } from 'lit';
type Config = {
    name: ShapeToolOption['shapeName'];
    generalIcon: TemplateResult<1>;
    scribbledIcon: TemplateResult<1>;
    tooltip: string;
    disabled: boolean;
};
export declare const ShapeComponentConfig: Config[];
export declare const ShapeComponentConfigMap: Record<import("@linvo-core/content").ShapeName, Config>;
export {};

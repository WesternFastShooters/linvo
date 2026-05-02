import { Bound } from '@linvo-core/global/gfx';
import type { GfxBlockElementModel, GfxCompatibleProps, GfxElementGeometry, GfxGroupCompatibleInterface, GfxModel, PointTestOptions } from '@linvo-core/std/gfx';
import { gfxGroupCompatibleSymbol } from '@linvo-core/std/gfx';
import { type Text } from '@linvo-core/store';
import { z } from 'zod';
import { type Color } from '../../theme';
export type FrameBlockProps = {
    title: Text;
    background: Color;
    childElementIds?: Record<string, boolean>;
    presentationIndex?: string;
    comments?: Record<string, boolean>;
} & GfxCompatibleProps;
export declare const FrameZodSchema: z.ZodDefault<z.ZodObject<{
    background: z.ZodUnion<[z.ZodString, z.ZodObject<{
        normal: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        normal: string;
    }, {
        normal: string;
    }>, z.ZodObject<{
        dark: z.ZodString;
        light: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        dark: string;
        light: string;
    }, {
        dark: string;
        light: string;
    }>]>;
}, "strip", z.ZodTypeAny, {
    background: string | {
        normal: string;
    } | {
        dark: string;
        light: string;
    };
}, {
    background: string | {
        normal: string;
    } | {
        dark: string;
        light: string;
    };
}>>;
export declare const FrameBlockSchema: {
    version: number;
    model: {
        props: import("@linvo-core/store").PropsGetter<FrameBlockProps>;
        flavour: "linvo:frame";
    } & {
        version: number;
        role: "content";
        parent: string[];
        children: never[];
    };
    transformer?: ((transformerConfig: Map<string, unknown>) => import("@linvo-core/store").BaseBlockTransformer<FrameBlockProps>) | undefined;
};
export declare const FrameBlockSchemaExtension: import("@linvo-core/composition").ExtensionType;
declare const FrameBlockModel_base: {
    new (): GfxBlockElementModel<FrameBlockProps>;
};
export declare class FrameBlockModel extends FrameBlockModel_base implements GfxElementGeometry, GfxGroupCompatibleInterface {
    [gfxGroupCompatibleSymbol]: true;
    get childElements(): GfxModel[];
    get childIds(): string[];
    get descendantElements(): GfxModel[];
    addChild(element: GfxModel): void;
    addChildren(elements: GfxModel[]): void;
    containsBound(bound: Bound): boolean;
    hasChild(element: GfxModel): boolean;
    hasDescendant(element: GfxModel): boolean;
    includesPoint(x: number, y: number, _: PointTestOptions): boolean;
    intersectsBound(selectedBound: Bound): boolean;
    removeChild(element: GfxModel): void;
}
export {};

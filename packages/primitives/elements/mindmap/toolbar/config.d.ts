import { MindmapElementModel } from '@linvo-core/content';
import { type ToolbarContext } from '@linvo-core/shared/services';
export declare const createMindmapStyleActionMenu: (ctx: ToolbarContext, models: MindmapElementModel[]) => import("lit-html").TemplateResult<1>;
export declare const createMindmapLayoutActionMenu: (ctx: ToolbarContext, models: MindmapElementModel[]) => import("lit-html").TemplateResult<1>;
export declare const mindmapToolbarConfig: {
    readonly actions: [{
        readonly id: "a.style";
        readonly content: (ctx: ToolbarContext) => import("lit-html").TemplateResult<1> | null;
    }, {
        readonly id: "b.layout";
        readonly content: (ctx: ToolbarContext) => import("lit-html").TemplateResult<1> | null;
    }];
    readonly when: (ctx: ToolbarContext) => boolean;
};
export declare const shapeMindmapToolbarConfig: {
    readonly actions: [{
        readonly id: "a.mindmap-style";
        readonly when: (ctx: ToolbarContext) => boolean;
        readonly content: (ctx: ToolbarContext) => import("lit-html").TemplateResult<1> | null;
    }, {
        readonly id: "b.mindmap-layout";
        readonly when: (ctx: ToolbarContext) => boolean;
        readonly content: (ctx: ToolbarContext) => import("lit-html").TemplateResult<1> | null;
    }];
    readonly when: (ctx: ToolbarContext) => boolean;
};
export declare const mindmapToolbarExtension: import("@linvo-core/composition").ExtensionType;
export declare const shapeMindmapToolbarExtension: import("@linvo-core/composition").ExtensionType;

export declare const textToolbarConfig: {
    readonly actions: [{
        readonly id: "a.font";
        readonly content: (ctx: import("@linvo-core/shared/services").ToolbarContext) => import("lit-html").TemplateResult<1> | null;
    }, {
        readonly id: "b.text-color";
        readonly content: (ctx: import("@linvo-core/shared/services").ToolbarContext) => import("lit-html").TemplateResult<1> | null;
    }, {
        readonly id: "c.font-style";
        readonly content: (ctx: import("@linvo-core/shared/services").ToolbarContext) => import("lit-html").TemplateResult<1> | null;
    }, {
        readonly id: "d.font-size";
        readonly content: (ctx: import("@linvo-core/shared/services").ToolbarContext) => import("lit-html").TemplateResult<1> | null;
    }, {
        readonly id: "e.alignment";
        readonly content: (ctx: import("@linvo-core/shared/services").ToolbarContext) => import("lit-html").TemplateResult<1> | null;
    }];
    readonly when: (ctx: import("@linvo-core/shared/services").ToolbarContext) => boolean;
};
export declare const textToolbarExtension: import("@linvo-core/composition").ExtensionType;

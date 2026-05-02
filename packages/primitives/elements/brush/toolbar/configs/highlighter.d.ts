export declare const highlighterToolbarConfig: {
    readonly actions: [{
        readonly id: "a.line-width";
        readonly content: (ctx: import("@linvo-core/shared/services").ToolbarContext) => import("lit-html").TemplateResult<1> | null;
    }, {
        readonly id: "b.color-picker";
        readonly content: (ctx: import("@linvo-core/shared/services").ToolbarContext) => import("lit-html").TemplateResult<1> | null;
    }];
    readonly when: (ctx: import("@linvo-core/shared/services").ToolbarContext) => boolean;
};
export declare const highlighterToolbarExtension: import("@linvo-core/composition").ExtensionType;

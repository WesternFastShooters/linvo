export declare const groupToolbarConfig: {
    readonly actions: [{
        readonly id: "b.rename";
        readonly tooltip: "Rename";
        readonly icon: import("lit-html").TemplateResult<1>;
        readonly when: (ctx: import("@linvo-core/shared/services").ToolbarContext) => boolean;
        readonly run: (ctx: import("@linvo-core/shared/services").ToolbarContext) => void;
    }, {
        readonly id: "b.ungroup";
        readonly tooltip: "Ungroup";
        readonly icon: import("lit-html").TemplateResult<1>;
        readonly run: (ctx: import("@linvo-core/shared/services").ToolbarContext) => void;
    }];
    readonly when: (ctx: import("@linvo-core/shared/services").ToolbarContext) => boolean;
};
export declare const groupToolbarExtension: import("@linvo-core/composition").ExtensionType;

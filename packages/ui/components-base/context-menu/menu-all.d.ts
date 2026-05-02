export declare const menu: {
    dynamic: (config: () => import("./menu").MenuConfig[]) => (menu: import("./menu").Menu) => import("lit-html").TemplateResult | undefined;
    group: (config: {
        name?: string;
        items: import("./menu").MenuConfig[];
    }) => (menu: import("./menu").Menu, index: number) => import("lit-html").TemplateResult | undefined;
    input: (config: {
        placeholder?: string;
        initialValue?: string;
        postfix?: import("lit-html").TemplateResult;
        prefix?: import("lit-html").TemplateResult;
        onComplete?: (value: string) => void;
        onChange?: (value: string) => void;
        class?: string;
        style?: Readonly<import("lit-html/directives/style-map.js").StyleInfo>;
    }) => (menu: import("./menu").Menu) => import("lit-html").TemplateResult<1> | undefined;
    subMenu: (config: {
        name: string;
        label?: () => import("lit-html").TemplateResult;
        select?: () => void;
        isSelected?: boolean;
        postfix?: import("lit-html").TemplateResult;
        prefix?: import("lit-html").TemplateResult;
        class?: string;
        options: import("./menu").MenuOptions;
        disableArrow?: boolean;
        hide?: () => boolean;
    }) => (menu: import("./menu").Menu) => import("lit-html").TemplateResult<1> | undefined;
    action: (config: {
        name: string;
        label?: () => import("lit-html").TemplateResult;
        prefix?: import("lit-html").TemplateResult;
        postfix?: import("lit-html").TemplateResult;
        isSelected?: boolean;
        select: (ele: HTMLElement) => void | false;
        onHover?: (hover: boolean) => void;
        class?: import("./types").MenuClass;
        hide?: () => boolean;
        testId?: string;
    }) => (menu: import("./menu").Menu) => import("lit-html").TemplateResult<1> | undefined;
    checkbox: (config: {
        name: string;
        checked: import("@preact/signals-core").ReadonlySignal<boolean>;
        postfix?: import("lit-html").TemplateResult;
        label?: () => import("lit-html").TemplateResult;
        select: (checked: boolean) => boolean;
        class?: import("lit-html/directives/class-map.js").ClassInfo;
        testId?: string;
    }) => (menu: import("./menu").Menu) => import("lit-html").TemplateResult<1> | undefined;
    toggleSwitch: (config: {
        name: string;
        on: boolean;
        prefix?: import("lit-html").TemplateResult;
        postfix?: import("lit-html").TemplateResult;
        label?: () => import("lit-html").TemplateResult;
        onChange: (on: boolean) => void;
        class?: import("lit-html/directives/class-map.js").ClassInfo;
        testId?: string;
    }) => (menu: import("./menu").Menu) => import("lit-html").TemplateResult<1> | undefined;
};

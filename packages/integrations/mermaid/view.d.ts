import { type ViewExtensionContext, ViewExtensionProvider } from '@linvo-core/composition';
export declare class MermaidViewExtension extends ViewExtensionProvider {
    name: string;
    effect(): void;
    setup(context: ViewExtensionContext): void;
}

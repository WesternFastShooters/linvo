import type { MermaidDiagramType, MermaidRenderResult } from './types';
type MermaidRuntime = {
    initialize(config: Record<string, unknown>): void;
    parse?(code: string): Promise<unknown>;
    detectType?(code: string): MermaidDiagramType | string;
    render(id: string, code: string): Promise<{
        svg: string;
        bindFunctions?: (element: Element) => void;
    }>;
};
declare global {
    interface Window {
        mermaid?: MermaidRuntime;
    }
}
export declare function ensureMermaidRuntime(): Promise<MermaidRuntime>;
export declare function renderMermaid(code: string): Promise<MermaidRenderResult>;
export declare function __setMermaidRuntimeForTesting(runtime: MermaidRuntime | null): void;
export {};

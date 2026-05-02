import type { EditorHost } from '@linvo-core/std';
/**
 * @example
 * ```ts
 * toast('Hello World');
 * ```
 */
export declare const toast: (editorHost: EditorHost, message: string, duration?: number) => HTMLDivElement;

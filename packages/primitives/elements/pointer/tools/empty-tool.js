import { BaseTool } from '@linvo-core/std/gfx';
/**
 * Empty tool that does nothing.
 */
export class EmptyTool extends BaseTool {
    static { this.toolName = 'empty'; }
}

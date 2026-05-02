import type { MindmapNode } from './mindmap-element-model';
export declare function findInfiniteLoop(root: MindmapNode, nodeMap: Map<string, MindmapNode>): {
    detached: boolean;
    chain: MindmapNode[];
}[];

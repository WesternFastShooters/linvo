import type { GfxCompatibleProps } from '@linvo-core/std/gfx';
import type { ReferenceInfo } from '../../../definitions/doc';
import type { EmbedCardStyle } from '../../../helpers';
export declare const EmbedSyncedDocStyles: ["syncedDoc"];
export type EmbedSyncedDocBlockProps = {
    style: EmbedCardStyle;
    caption?: string | null;
    scale?: number;
    /**
     * Record the scaled height of the synced doc block when it is folded,
     * a.k.a the fourth number of the `xywh`
     */
    preFoldHeight?: number;
} & ReferenceInfo & GfxCompatibleProps;
declare const EmbedSyncedDocModel_base: {
    new (): import("@linvo-core/std/gfx").GfxBlockElementModel<import("../../..").EmbedProps<EmbedSyncedDocBlockProps>>;
};
export declare class EmbedSyncedDocModel extends EmbedSyncedDocModel_base {
    get isFolded(): boolean;
}
export {};

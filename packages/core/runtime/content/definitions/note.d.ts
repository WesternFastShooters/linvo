import { z } from 'zod';
export declare const NOTE_MIN_WIDTH: number;
export declare const NOTE_MIN_HEIGHT = 92;
export declare const DEFAULT_NOTE_WIDTH: number;
export declare const DEFAULT_NOTE_HEIGHT = 92;
export declare const DEFAULT_PAGE_BLOCK_WIDTH = 800;
export declare const DEFAULT_PAGE_BLOCK_HEIGHT = 92;
export declare enum NoteShadow {
    Box = "--linvo-note-shadow-box",
    Film = "--linvo-note-shadow-film",
    Float = "--linvo-note-shadow-float",
    None = "",
    Paper = "--linvo-note-shadow-paper",
    Sticker = "--linvo-note-shadow-sticker"
}
export declare const NoteShadowMap: Record<NoteShadow, "None" | "Box" | "Film" | "Float" | "Paper" | "Sticker">;
export declare const NOTE_SHADOWS: readonly [NoteShadow.None, NoteShadow.Box, NoteShadow.Sticker, NoteShadow.Paper, NoteShadow.Float, NoteShadow.Film];
export declare const DEFAULT_NOTE_SHADOW = NoteShadow.Box;
export declare const NoteShadowsSchema: z.ZodNativeEnum<typeof NoteShadow>;
export declare enum NoteDisplayMode {
    DocAndEdgeless = "both",
    DocOnly = "doc",
    EdgelessOnly = "edgeless"
}
export declare enum StrokeStyle {
    Dash = "dash",
    None = "none",
    Solid = "solid"
}
export declare const StrokeStyleSchema: z.ZodNativeEnum<typeof StrokeStyle>;
export declare const NoteDisplayModeSchema: z.ZodNativeEnum<typeof NoteDisplayMode>;
export declare const DEFAULT_NOTE_BORDER_STYLE = StrokeStyle.None;
export declare const StrokeStyleMap: Record<StrokeStyle, "None" | "Dash" | "Solid">;
export declare enum NoteCorners {
    Huge = 32,
    Large = 24,
    Medium = 16,
    None = 0,
    Small = 8
}
export declare const NoteCornersMap: Record<NoteCorners, "Medium" | "None" | "Huge" | "Large" | "Small">;
export declare const NOTE_CORNERS: readonly [NoteCorners.None, NoteCorners.Small, NoteCorners.Medium, NoteCorners.Large, NoteCorners.Huge];
export declare const DEFAULT_NOTE_CORNER = NoteCorners.Small;
export declare const NoteCornersSchema: z.ZodNativeEnum<typeof NoteCorners>;
export declare const DEFAULT_NOTE_BORDER_SIZE = 4;

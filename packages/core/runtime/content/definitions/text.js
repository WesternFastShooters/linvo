import { z } from 'zod';
import { createEnumMap } from '../helpers/enum';
export var TextAlign;
(function (TextAlign) {
    TextAlign["Center"] = "center";
    TextAlign["Left"] = "left";
    TextAlign["Right"] = "right";
})(TextAlign || (TextAlign = {}));
export const TextAlignMap = createEnumMap(TextAlign);
export var TextVerticalAlign;
(function (TextVerticalAlign) {
    TextVerticalAlign["Bottom"] = "bottom";
    TextVerticalAlign["Center"] = "center";
    TextVerticalAlign["Top"] = "top";
})(TextVerticalAlign || (TextVerticalAlign = {}));
export var FontWeight;
(function (FontWeight) {
    FontWeight["Bold"] = "700";
    FontWeight["Light"] = "300";
    FontWeight["Medium"] = "500";
    FontWeight["Regular"] = "400";
    FontWeight["SemiBold"] = "600";
})(FontWeight || (FontWeight = {}));
export const FontWeightMap = createEnumMap(FontWeight);
export var FontStyle;
(function (FontStyle) {
    FontStyle["Italic"] = "italic";
    FontStyle["Normal"] = "normal";
})(FontStyle || (FontStyle = {}));
export var FontFamily;
(function (FontFamily) {
    FontFamily["BebasNeue"] = "linvo:surface:BebasNeue";
    FontFamily["Inter"] = "linvo:surface:Inter";
    FontFamily["Kalam"] = "linvo:surface:Kalam";
    FontFamily["Lora"] = "linvo:surface:Lora";
    FontFamily["OrelegaOne"] = "linvo:surface:OrelegaOne";
    FontFamily["Poppins"] = "linvo:surface:Poppins";
    FontFamily["Satoshi"] = "linvo:surface:Satoshi";
})(FontFamily || (FontFamily = {}));
export const FontFamilyMap = createEnumMap(FontFamily);
export const FontFamilyList = Object.entries(FontFamilyMap);
export var TextResizing;
(function (TextResizing) {
    TextResizing[TextResizing["AUTO_WIDTH_AND_HEIGHT"] = 0] = "AUTO_WIDTH_AND_HEIGHT";
    TextResizing[TextResizing["AUTO_HEIGHT"] = 1] = "AUTO_HEIGHT";
})(TextResizing || (TextResizing = {}));
export const FontFamilySchema = z.nativeEnum(FontFamily);
export const FontWeightSchema = z.nativeEnum(FontWeight);
export const FontStyleSchema = z.nativeEnum(FontStyle);
export const TextAlignSchema = z.nativeEnum(TextAlign);

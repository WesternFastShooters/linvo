export const DEFAULT_ROUGHNESS = 1.4;
// TODO: need to check the default central area ratio
export const DEFAULT_CENTRAL_AREA_RATIO = 0.3;
export var ShapeTextFontSize;
(function (ShapeTextFontSize) {
    ShapeTextFontSize[ShapeTextFontSize["LARGE"] = 28] = "LARGE";
    ShapeTextFontSize[ShapeTextFontSize["MEDIUM"] = 20] = "MEDIUM";
    ShapeTextFontSize[ShapeTextFontSize["SMALL"] = 12] = "SMALL";
    ShapeTextFontSize[ShapeTextFontSize["XLARGE"] = 36] = "XLARGE";
})(ShapeTextFontSize || (ShapeTextFontSize = {}));
export var ShapeType;
(function (ShapeType) {
    ShapeType["Rect"] = "rect";
    ShapeType["Ellipse"] = "ellipse";
    ShapeType["Diamond"] = "diamond";
    ShapeType["Triangle"] = "triangle";
    ShapeType["Hexagon"] = "hexagon";
    ShapeType["Pentagon"] = "pentagon";
    ShapeType["Octagon"] = "octagon";
    ShapeType["Parallelogram"] = "parallelogram";
    ShapeType["LeanLeft"] = "leanLeft";
    ShapeType["Trapezoid"] = "trapezoid";
    ShapeType["TrapezoidAlt"] = "trapezoidAlt";
    ShapeType["Stadium"] = "stadium";
    ShapeType["Subroutine"] = "subroutine";
    ShapeType["Cylinder"] = "cylinder";
    ShapeType["HorizontalCylinder"] = "horizontalCylinder";
    ShapeType["LinedCylinder"] = "linedCylinder";
    ShapeType["Document"] = "document";
    ShapeType["LinedDocument"] = "linedDocument";
    ShapeType["MultiDocument"] = "multiDocument";
    ShapeType["Note"] = "note";
    ShapeType["Package"] = "package";
    ShapeType["Cloud"] = "cloud";
    ShapeType["DoubleCircle"] = "doubleCircle";
    ShapeType["FilledCircle"] = "filledCircle";
    ShapeType["Asymmetric"] = "asymmetric";
    ShapeType["Hourglass"] = "hourglass";
    ShapeType["NotchedRect"] = "notchedRect";
    ShapeType["NotchedPentagon"] = "notchedPentagon";
    ShapeType["Bolt"] = "bolt";
    ShapeType["Bang"] = "bang";
    ShapeType["Flag"] = "flag";
    ShapeType["BowRect"] = "bowRect";
    ShapeType["SmallCircle"] = "smallCircle";
    ShapeType["FramedCircle"] = "framedCircle";
    ShapeType["CrossedCircle"] = "crossedCircle";
    ShapeType["TaggedDocument"] = "taggedDocument";
    ShapeType["TaggedRect"] = "taggedRect";
    ShapeType["BraceLeft"] = "braceLeft";
    ShapeType["BraceRight"] = "braceRight";
    ShapeType["Braces"] = "braces";
    ShapeType["Delay"] = "delay";
    ShapeType["CurvedTrapezoid"] = "curvedTrapezoid";
    ShapeType["DividedRect"] = "dividedRect";
    ShapeType["ForkJoin"] = "forkJoin";
    ShapeType["WindowPane"] = "windowPane";
    ShapeType["LinedRect"] = "linedRect";
    ShapeType["FlippedTriangle"] = "flippedTriangle";
    ShapeType["SlopedRect"] = "slopedRect";
    ShapeType["StackedRect"] = "stackedRect";
    ShapeType["Odd"] = "odd";
})(ShapeType || (ShapeType = {}));
export function getShapeName(type, radius) {
    if (type === ShapeType.Rect && radius > 0) {
        return 'roundedRect';
    }
    return type;
}
export function getShapeType(name) {
    if (name === 'roundedRect') {
        return ShapeType.Rect;
    }
    return name;
}
export function getShapeRadius(name) {
    if (name === 'roundedRect') {
        return 0.1;
    }
    return 0;
}
export var ShapeStyle;
(function (ShapeStyle) {
    ShapeStyle["General"] = "General";
    ShapeStyle["Scribbled"] = "Scribbled";
})(ShapeStyle || (ShapeStyle = {}));

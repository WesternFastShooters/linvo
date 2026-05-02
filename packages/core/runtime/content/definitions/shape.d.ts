export declare const DEFAULT_ROUGHNESS = 1.4;
export declare const DEFAULT_CENTRAL_AREA_RATIO = 0.3;
export declare enum ShapeTextFontSize {
    LARGE = 28,
    MEDIUM = 20,
    SMALL = 12,
    XLARGE = 36
}
export declare enum ShapeType {
    Rect = "rect",
    Ellipse = "ellipse",
    Diamond = "diamond",
    Triangle = "triangle",
    Hexagon = "hexagon",
    Pentagon = "pentagon",
    Octagon = "octagon",
    Parallelogram = "parallelogram",
    LeanLeft = "leanLeft",
    Trapezoid = "trapezoid",
    TrapezoidAlt = "trapezoidAlt",
    Stadium = "stadium",
    Subroutine = "subroutine",
    Cylinder = "cylinder",
    HorizontalCylinder = "horizontalCylinder",
    LinedCylinder = "linedCylinder",
    Document = "document",
    LinedDocument = "linedDocument",
    MultiDocument = "multiDocument",
    Note = "note",
    Package = "package",
    Cloud = "cloud",
    DoubleCircle = "doubleCircle",
    FilledCircle = "filledCircle",
    Asymmetric = "asymmetric",
    Hourglass = "hourglass",
    NotchedRect = "notchedRect",
    NotchedPentagon = "notchedPentagon",
    Bolt = "bolt",
    Bang = "bang",
    Flag = "flag",
    BowRect = "bowRect",
    SmallCircle = "smallCircle",
    FramedCircle = "framedCircle",
    CrossedCircle = "crossedCircle",
    TaggedDocument = "taggedDocument",
    TaggedRect = "taggedRect",
    BraceLeft = "braceLeft",
    BraceRight = "braceRight",
    Braces = "braces",
    Delay = "delay",
    CurvedTrapezoid = "curvedTrapezoid",
    DividedRect = "dividedRect",
    ForkJoin = "forkJoin",
    WindowPane = "windowPane",
    LinedRect = "linedRect",
    FlippedTriangle = "flippedTriangle",
    SlopedRect = "slopedRect",
    StackedRect = "stackedRect",
    Odd = "odd"
}
export type ShapeName = ShapeType | 'roundedRect';
export declare function getShapeName(type: ShapeType, radius: number): ShapeName;
export declare function getShapeType(name: ShapeName): ShapeType;
export declare function getShapeRadius(name: ShapeName): number;
export declare enum ShapeStyle {
    General = "General",
    Scribbled = "Scribbled"
}

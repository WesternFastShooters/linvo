import type { Config, Drawable, OpSet, Options, ResolvedOptions } from './core';
import { RoughGenerator } from './generator';
import type { Point } from './geometry';
export declare class RoughSVG {
    private readonly gen;
    private readonly svg;
    get generator(): RoughGenerator;
    constructor(svg: SVGSVGElement, config?: Config);
    private fillSketch;
    arc(x: number, y: number, width: number, height: number, start: number, stop: number, closed?: boolean, options?: Options): SVGGElement;
    circle(x: number, y: number, diameter: number, options?: Options): SVGGElement;
    curve(points: Point[], options?: Options): SVGGElement;
    draw(drawable: Drawable): SVGGElement;
    ellipse(x: number, y: number, width: number, height: number, options?: Options): SVGGElement;
    getDefaultOptions(): ResolvedOptions;
    line(x1: number, y1: number, x2: number, y2: number, options?: Options): SVGGElement;
    linearPath(points: Point[], options?: Options): SVGGElement;
    opsToPath(drawing: OpSet, fixedDecimalPlaceDigits?: number): string;
    path(d: string, options?: Options): SVGGElement;
    polygon(points: Point[], options?: Options): SVGGElement;
    rectangle(x: number, y: number, width: number, height: number, options?: Options): SVGGElement;
}

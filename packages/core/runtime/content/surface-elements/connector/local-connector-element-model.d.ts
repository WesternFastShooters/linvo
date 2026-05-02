import type { PointLocation } from '@linvo-core/global/gfx';
import { GfxLocalElementModel } from '@linvo-core/std/gfx';
import { ConnectorMode, type PointStyle, StrokeStyle } from '../../definitions';
import { type Color } from '../../theme';
import type { Connection } from './connector-element-model';
export declare class LocalConnectorElementModel extends GfxLocalElementModel {
    private _path;
    absolutePath: PointLocation[];
    frontEndpointStyle: PointStyle;
    mode: ConnectorMode;
    rearEndpointStyle: PointStyle;
    rough?: boolean;
    roughness: number;
    source: Connection;
    stroke: Color;
    strokeStyle: StrokeStyle;
    strokeWidth: number;
    target: Connection;
    updatingPath: boolean;
    get path(): PointLocation[];
    set path(value: PointLocation[]);
    get type(): string;
}

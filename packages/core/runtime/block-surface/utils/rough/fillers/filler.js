import { DashedFiller } from './dashed-filler';
import { DotFiller } from './dot-filler';
import { HachureFiller } from './hachure-filler';
import { HatchFiller } from './hatch-filler';
import { ZigZagFiller } from './zigzag-filler';
import { ZigZagLineFiller } from './zigzag-line-filler';
const fillers = {};
export function getFiller(o, helper) {
    let fillerName = o.fillStyle || 'hachure';
    if (!fillers[fillerName]) {
        switch (fillerName) {
            case 'zigzag':
                if (!fillers[fillerName]) {
                    fillers[fillerName] = new ZigZagFiller(helper);
                }
                break;
            case 'cross-hatch':
                if (!fillers[fillerName]) {
                    fillers[fillerName] = new HatchFiller(helper);
                }
                break;
            case 'dots':
                if (!fillers[fillerName]) {
                    fillers[fillerName] = new DotFiller(helper);
                }
                break;
            case 'dashed':
                if (!fillers[fillerName]) {
                    fillers[fillerName] = new DashedFiller(helper);
                }
                break;
            case 'zigzag-line':
                if (!fillers[fillerName]) {
                    fillers[fillerName] = new ZigZagLineFiller(helper);
                }
                break;
            case 'hachure':
            default:
                fillerName = 'hachure';
                if (!fillers[fillerName]) {
                    fillers[fillerName] = new HachureFiller(helper);
                }
                break;
        }
    }
    return fillers[fillerName];
}

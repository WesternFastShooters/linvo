import { cloneElementState, serializeElementState, } from '@linvo-core/shared/whiteboard/utils';
export class LocalElementModel {
    constructor(surface, state) {
        this.surface = surface;
        this.state = state;
    }
    get id() {
        return this.state.id;
    }
    get index() {
        return this.state.index;
    }
    get seed() {
        return this.state.seed;
    }
    get type() {
        return this.state.type;
    }
    get xywh() {
        return this.state.xywh;
    }
    delete(options) {
        this.surface.deleteElement(this.id, options);
    }
    get(key) {
        return this.state[key];
    }
    getState() {
        return cloneElementState(this.state);
    }
    patch(props, options) {
        this.surface.updateElement(this.id, props, options);
    }
    serialize() {
        return serializeElementState(this.state);
    }
    set(key, value, options) {
        this.surface.updateElement(this.id, { [key]: value }, options);
    }
    setRecord(key, value, options) {
        this.surface.updateElement(this.id, { [key]: value }, options);
    }
}

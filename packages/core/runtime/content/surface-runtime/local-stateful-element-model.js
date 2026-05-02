import { Subject } from 'rxjs';
import { LocalElementModel } from './local-element-model';
import { runLocalDecorators } from './field-decorators';
import { cloneRecordValue } from '@linvo-core/shared/whiteboard/utils';
export class LocalStatefulElementModel extends LocalElementModel {
    constructor(surface, state) {
        super(surface, state);
        this.propsUpdated = new Subject();
        this._local = new Map();
    }
    _emitPropUpdated(key, local) {
        const value = key in this.state ? this.state[key] : this._local.get(key);
        runLocalDecorators(this, key, value, local);
        this.propsUpdated.next({ key, local });
    }
    _readField(key, fallback) {
        return (this.state[key] ?? fallback);
    }
    _readLocal(key, fallback) {
        return (this._local.get(key) ?? fallback);
    }
    _writeField(key, value) {
        this.patch({ [key]: value }, { label: `set-${key}` });
    }
    _writeLocal(key, value) {
        this._local.set(key, cloneRecordValue(value));
        this._emitPropUpdated(key, true);
    }
}

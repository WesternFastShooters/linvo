const fieldPropsSymbol = Symbol('field-props');
const localPropsSymbol = Symbol('local-props');
const watchMapSymbol = Symbol('watch-map');
const observeMapSymbol = Symbol('observe-map');
function getOrCreateSet(target, symbol) {
    const proto = Object.getPrototypeOf(target);
    if (!Object.hasOwn(proto, symbol)) {
        Object.defineProperty(proto, symbol, {
            configurable: true,
            enumerable: false,
            value: new Set(),
            writable: true,
        });
    }
    return proto[symbol];
}
function getOrCreateCallbackMap(target, symbol) {
    const proto = Object.getPrototypeOf(target);
    if (!Object.hasOwn(proto, symbol)) {
        Object.defineProperty(proto, symbol, {
            configurable: true,
            enumerable: false,
            value: new Map(),
            writable: true,
        });
    }
    return proto[symbol];
}
export function getFieldPropsSet(target) {
    return getOrCreateSet(target, fieldPropsSymbol);
}
export function getLocalPropsSet(target) {
    return getOrCreateSet(target, localPropsSymbol);
}
export function field(fallback) {
    return function fieldDecorator(_, context) {
        const key = context.name;
        return {
            init(value) {
                getFieldPropsSet(this).add(key);
                return value;
            },
            get() {
                return this._readField(key, fallback);
            },
            set(value) {
                this._writeField(key, value);
            },
        };
    };
}
export function local(fallback) {
    return function localDecorator(_, context) {
        const key = context.name;
        return {
            init(value) {
                getLocalPropsSet(this).add(key);
                return value;
            },
            get() {
                return this._readLocal(key, fallback);
            },
            set(value) {
                this._writeLocal(key, value);
            },
        };
    };
}
export function watch(callback) {
    return function watchDecorator(_, context) {
        return {
            init(value) {
                const map = getOrCreateCallbackMap(this, watchMapSymbol);
                const callbacks = map.get(context.name) ?? [];
                callbacks.push(callback);
                map.set(context.name, callbacks);
                return value;
            },
        };
    };
}
export function observe(callback) {
    return function observeDecorator(_, context) {
        return {
            init(value) {
                const map = getOrCreateCallbackMap(this, observeMapSymbol);
                const callbacks = map.get(context.name) ?? [];
                callbacks.push(callback);
                map.set(context.name, callbacks);
                return value;
            },
        };
    };
}
export function runLocalDecorators(target, key, value, local) {
    const proto = Object.getPrototypeOf(target);
    const watchMap = (proto[watchMapSymbol] ??
        new Map());
    const observeMap = (proto[observeMapSymbol] ??
        new Map());
    [...(watchMap.get(key) ?? []), ...(observeMap.get(key) ?? [])].forEach(callback => {
        callback(value, target, local);
    });
}

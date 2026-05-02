import type { LocalStatefulElementModel } from './local-stateful-element-model';

type DecoratorCallback = (
  value: unknown,
  instance: LocalStatefulElementModel,
  local: boolean
) => void;

const fieldPropsSymbol = Symbol('field-props');
const localPropsSymbol = Symbol('local-props');
const watchMapSymbol = Symbol('watch-map');
const observeMapSymbol = Symbol('observe-map');

function getOrCreateSet(target: object, symbol: symbol) {
  const proto = Object.getPrototypeOf(target);
  if (!Object.hasOwn(proto, symbol)) {
    Object.defineProperty(proto, symbol, {
      configurable: true,
      enumerable: false,
      value: new Set<string | symbol>(),
      writable: true,
    });
  }

  return proto[symbol] as Set<string | symbol>;
}

function getOrCreateCallbackMap(target: object, symbol: symbol) {
  const proto = Object.getPrototypeOf(target);
  if (!Object.hasOwn(proto, symbol)) {
    Object.defineProperty(proto, symbol, {
      configurable: true,
      enumerable: false,
      value: new Map<string | symbol, DecoratorCallback[]>(),
      writable: true,
    });
  }

  return proto[symbol] as Map<string | symbol, DecoratorCallback[]>;
}

export function getFieldPropsSet(target: object) {
  return getOrCreateSet(target, fieldPropsSymbol);
}

export function getLocalPropsSet(target: object) {
  return getOrCreateSet(target, localPropsSymbol);
}

export function field<
  T extends LocalStatefulElementModel,
  V,
>(fallback?: V) {
  return function fieldDecorator(
    _: ClassAccessorDecoratorTarget<T, V>,
    context: ClassAccessorDecoratorContext<T, V>
  ) {
    const key = context.name;

    return {
      init(this: T, value: V) {
        getFieldPropsSet(this).add(key);
        return value;
      },
      get(this: T) {
        return this._readField(key as string, fallback) as V;
      },
      set(this: T, value: V) {
        this._writeField(key as string, value);
      },
    } as ClassAccessorDecoratorResult<T, V>;
  };
}

export function local<
  T extends LocalStatefulElementModel,
  V,
>(fallback?: V) {
  return function localDecorator(
    _: ClassAccessorDecoratorTarget<T, V>,
    context: ClassAccessorDecoratorContext<T, V>
  ) {
    const key = context.name;

    return {
      init(this: T, value: V) {
        getLocalPropsSet(this).add(key);
        return value;
      },
      get(this: T) {
        return this._readLocal(key as string, fallback) as V;
      },
      set(this: T, value: V) {
        this._writeLocal(key as string, value);
      },
    } as ClassAccessorDecoratorResult<T, V>;
  };
}

export function watch<T extends LocalStatefulElementModel, V>(
  callback: (value: V, instance: T, local: boolean) => void
) {
  return function watchDecorator(
    _: unknown,
    context: ClassAccessorDecoratorContext<T, V>
  ) {
    return {
      init(this: T, value: V) {
        const map = getOrCreateCallbackMap(this, watchMapSymbol);
        const callbacks = map.get(context.name) ?? [];
        callbacks.push(callback as DecoratorCallback);
        map.set(context.name, callbacks);
        return value;
      },
    } as ClassAccessorDecoratorResult<T, V>;
  };
}

export function observe<T extends LocalStatefulElementModel, V>(
  callback: (value: V, instance: T, local: boolean) => void
) {
  return function observeDecorator(
    _: unknown,
    context: ClassAccessorDecoratorContext<T, V>
  ) {
    return {
      init(this: T, value: V) {
        const map = getOrCreateCallbackMap(this, observeMapSymbol);
        const callbacks = map.get(context.name) ?? [];
        callbacks.push(callback as DecoratorCallback);
        map.set(context.name, callbacks);
        return value;
      },
    } as ClassAccessorDecoratorResult<T, V>;
  };
}

export function runLocalDecorators(
  target: LocalStatefulElementModel,
  key: string,
  value: unknown,
  local: boolean
) {
  const proto = Object.getPrototypeOf(target);
  const watchMap = (proto[watchMapSymbol] ??
    new Map()) as Map<string | symbol, DecoratorCallback[]>;
  const observeMap = (proto[observeMapSymbol] ??
    new Map()) as Map<string | symbol, DecoratorCallback[]>;

  [...(watchMap.get(key) ?? []), ...(observeMap.get(key) ?? [])].forEach(
    callback => {
      callback(value, target, local);
    }
  );
}

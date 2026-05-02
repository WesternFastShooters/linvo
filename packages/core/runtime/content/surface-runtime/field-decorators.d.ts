import type { LocalStatefulElementModel } from './local-stateful-element-model';
export declare function getFieldPropsSet(target: object): Set<string | symbol>;
export declare function getLocalPropsSet(target: object): Set<string | symbol>;
export declare function field<T extends LocalStatefulElementModel, V>(fallback?: V): (_: ClassAccessorDecoratorTarget<T, V>, context: ClassAccessorDecoratorContext<T, V>) => ClassAccessorDecoratorResult<T, V>;
export declare function local<T extends LocalStatefulElementModel, V>(fallback?: V): (_: ClassAccessorDecoratorTarget<T, V>, context: ClassAccessorDecoratorContext<T, V>) => ClassAccessorDecoratorResult<T, V>;
export declare function watch<T extends LocalStatefulElementModel, V>(callback: (value: V, instance: T, local: boolean) => void): (_: unknown, context: ClassAccessorDecoratorContext<T, V>) => ClassAccessorDecoratorResult<T, V>;
export declare function observe<T extends LocalStatefulElementModel, V>(callback: (value: V, instance: T, local: boolean) => void): (_: unknown, context: ClassAccessorDecoratorContext<T, V>) => ClassAccessorDecoratorResult<T, V>;
export declare function runLocalDecorators(target: LocalStatefulElementModel, key: string, value: unknown, local: boolean): void;

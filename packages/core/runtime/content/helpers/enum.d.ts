export declare function createEnumMap<T extends Record<string, string | number>>(EnumObject: T): Record<T[keyof T], keyof T>;

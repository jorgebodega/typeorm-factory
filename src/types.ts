import type { InstanceAttribute } from "./instanceAttributes";
import type { CollectionSubfactory, SingleSubfactory } from "./subfactories";

export type FactorizedAttrs<T> = {
	[K in keyof Partial<T>]: FactorizedAttr<T[K]> | InstanceAttribute<T, FactorizedAttr<T[K]>>;
};

export type FactorizedAttr<V> = [NonNullable<V>] extends [Array<infer U>]
	? ArrayFactorizedAttr<U> | Extract<V, null | undefined>
	: SingleFactorizedAttr<V>;

export type SingleFactorizedAttr<V> = V | (() => V | Promise<V>) | SingleSubfactory<IsObject<V>>;

export type ArrayFactorizedAttr<V> =
	| Array<SingleFactorizedAttr<V>>
	| (() => V[] | Promise<V[]>)
	| CollectionSubfactory<IsObject<V>>;

export type InstanceAttributeCallback<T, V> = (entity: T) => V | Promise<V>;

export type Constructable<T> = new () => T;
export type IsObject<T> = T extends object ? T : never;

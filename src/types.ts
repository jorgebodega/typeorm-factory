import type { InstanceAttribute } from "./instanceAttributes";
import type { CollectionSubfactory, SingleSubfactory } from "./subfactories";

export type FactorizedAttrs<T> = {
	[K in keyof Partial<T>]: FactorizedAttr<T[K]> | InstanceAttribute<T, FactorizedAttr<T[K]>>;
};

export type FactorizedAttr<V> =
	| V
	| (() => V | Promise<V>)
	| (V extends Array<infer U> ? ArrayFactorizedAttr<U> : SingleSubfactory<IsObject<V>>);

export type SingleFactorizedAttr<V> = V | (() => V | Promise<V>) | SingleSubfactory<IsObject<V>>;

export type ArrayFactorizedAttr<V> = Array<SingleFactorizedAttr<V>> | CollectionSubfactory<IsObject<V>>;

export type InstanceAttributeCallback<T, V> = (entity: T) => V | Promise<V>;

export type Constructable<T> = new () => T;
export type IsObject<T> = T extends object ? T : never;
export type GetChildAttrs<T> = (index: number) => Partial<FactorizedAttrs<T>>;
export type SequenceAttrs<T> = GetChildAttrs<T> | Partial<FactorizedAttrs<T>> | Partial<FactorizedAttrs<T>>[];

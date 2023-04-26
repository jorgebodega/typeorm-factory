import type { InstanceAttribute } from './instanceAttributes'
import type { CollectionSubfactory, SingleSubfactory } from './subfactories'

export type FactorizedAttrs<T> = {
  [K in keyof Partial<T>]: FactorizedAttr<T[K]> | InstanceAttribute<T, FactorizedAttr<T[K]>>
}

export type FactorizedAttr<V> = V extends Array<infer U> ? ArrayFactorizedAttr<U> : SingleFactorizedAttr<V>

// If the factorized attr is a single value, then it should be the same type or resolve to that value
export type SingleFactorizedAttr<V> = V | (() => V | Promise<V>) | SingleSubfactory<IsObject<V>>
// If the factorized attr is a list, then it should be a list of SingleFactorizedAttr or a collection subfactory
export type ArrayFactorizedAttr<V> = Array<SingleFactorizedAttr<V>> | CollectionSubfactory<IsObject<V>>

// The function of an instance attribute must resolve always to a FactorizedAttr
export type InstanceAttributeCallback<T, V> = (entity: T) => FactorizedAttr<V>

// Helper types
export type Constructable<T> = new () => T
export type IsObject<T> = T extends object ? T : never

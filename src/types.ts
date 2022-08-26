import type { InstanceAttribute } from './instanceAttributes'
import type { CollectionSubfactory, SingleSubfactory } from './subfactories'

export type IsObject<T> = T extends object ? T : never
export type Constructable<T> = new () => T
export type FactorizedSubfactory<V> =
  | CollectionSubfactory<V extends Array<infer U> ? IsObject<U> : never>
  | SingleSubfactory<V extends Array<unknown> ? never : IsObject<V>>
export type FactorizedAttr<V> = V | (() => V | Promise<V>) | FactorizedSubfactory<V>
export type FactorizedAttrs<T> = {
  [K in keyof Partial<T>]: FactorizedAttr<T[K]> | InstanceAttribute<T, FactorizedAttr<T[K]>>
}
export type InstanceAttributeCallback<T, V> = (entity: T) => V

import type { InstanceAttribute } from './instanceAttributes'
import type { CollectionSubfactory, SingleSubfactory } from './subfactories'

export type Constructable<T> = new () => T
export type FactorizedAttr<V> =
  | V
  | (() => V | Promise<V>)
  | CollectionSubfactory<V extends Array<infer U> ? U : never>
  | SingleSubfactory<V extends Array<unknown> ? never : V>
export type FactorizedAttrs<T> = {
  [K in keyof Partial<T>]: FactorizedAttr<T[K]> | InstanceAttribute<T, FactorizedAttr<T[K]>>
}
export type InstanceAttributeCallback<T, V> = (entity: T) => V

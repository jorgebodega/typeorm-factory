import type { LazyAttribute } from './lazyAttribute'
import { CollectionSubfactory, SingleSubfactory } from './subfactories'

export type Constructable<T> = new () => T
export type FactorizedAttr<V> =
  | V
  | (() => V | Promise<V>)
  | CollectionSubfactory<V extends Array<infer U> ? U : never>
  | SingleSubfactory<V extends Array<unknown> ? never : V>
export type FactorizedAttrs<T> = {
  [K in keyof Partial<T>]: FactorizedAttr<T[K]> | LazyAttribute<T, FactorizedAttr<T[K]>>
}
export type LazyAttributeCallback<T, V> = (entity: T) => V

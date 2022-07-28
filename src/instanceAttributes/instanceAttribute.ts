import type { FactorizedAttr, InstanceAttributeCallback } from '../types'

export abstract class InstanceAttribute<T, V> {
  constructor(private callback: InstanceAttributeCallback<T, V>) {}

  resolve(entity: T): FactorizedAttr<V> {
    return this.callback(entity)
  }
}

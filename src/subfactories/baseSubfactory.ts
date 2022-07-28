import type { Factory } from '../factory'
import type { Constructable, FactorizedAttrs } from '../types'

export abstract class BaseSubfactory<T> {
  protected factoryInstance: Factory<T>

  constructor(factory: Constructable<Factory<T>>, protected values?: Partial<FactorizedAttrs<T>>) {
    this.factoryInstance = new factory()
  }

  abstract create(): Promise<T> | Promise<T[]>
  abstract make(): Promise<T> | Promise<T[]>
}

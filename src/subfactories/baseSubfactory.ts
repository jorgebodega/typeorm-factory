import { Factory } from '../factory'
import type { Constructable, FactorizedAttrs } from '../types'

export abstract class BaseSubfactory<T> {
  protected factoryInstance: Factory<T>

  constructor(
    factoryOrFactoryInstance: Constructable<Factory<T>> | Factory<T>,
    protected values?: Partial<FactorizedAttrs<T>>,
  ) {
    this.factoryInstance =
      factoryOrFactoryInstance instanceof Factory ? factoryOrFactoryInstance : new factoryOrFactoryInstance()
  }

  abstract create(): Promise<T> | Promise<T[]>
  abstract make(): Promise<T> | Promise<T[]>
}

import type { Factory } from '../factory'
import type { Constructable, FactorizedAttrs } from '../types'
import { BaseSubfactory } from './baseSubfactory'

export class CollectionSubfactory<T extends object> extends BaseSubfactory<T> {
  constructor(
    factoryOrFactoryInstance: Constructable<Factory<T>> | Factory<T>,
    private count: number,
    values?: Partial<FactorizedAttrs<T>>,
  ) {
    super(factoryOrFactoryInstance, values)
  }

  create() {
    return this.factoryInstance.createMany(this.count, this.values)
  }

  make() {
    return this.factoryInstance.makeMany(this.count, this.values)
  }
}

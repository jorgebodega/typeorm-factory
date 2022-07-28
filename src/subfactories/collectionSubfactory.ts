import type { Factory } from '../factory'
import type { Constructable, FactorizedAttrs } from '../types'
import { BaseSubfactory } from './baseSubfactory'

export class CollectionSubfactory<T> extends BaseSubfactory<T> {
  constructor(factory: Constructable<Factory<T>>, private count: number, values?: Partial<FactorizedAttrs<T>>) {
    super(factory, values)
  }

  create() {
    return this.factoryInstance.createMany(this.count, this.values)
  }

  make() {
    return this.factoryInstance.makeMany(this.count, this.values)
  }
}

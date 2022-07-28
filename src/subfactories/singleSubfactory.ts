import type { Factory } from '../factory'
import type { Constructable, FactorizedAttrs } from '../types'
import { BaseSubfactory } from './baseSubfactory'

export class SingleSubfactory<T> extends BaseSubfactory<T> {
  constructor(factory: Constructable<Factory<T>>, values?: Partial<FactorizedAttrs<T>>) {
    super(factory, values)
  }

  create() {
    return this.factoryInstance.create(this.values)
  }

  make() {
    return this.factoryInstance.make(this.values)
  }
}

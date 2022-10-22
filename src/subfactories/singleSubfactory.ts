import type { Factory } from '../factory'
import type { Constructable, FactorizedAttrs } from '../types'
import { BaseSubfactory } from './baseSubfactory'

export class SingleSubfactory<T extends object> extends BaseSubfactory<T> {
  constructor(factoryOrFactoryInstance: Constructable<Factory<T>> | Factory<T>, values?: Partial<FactorizedAttrs<T>>) {
    super(factoryOrFactoryInstance, values)
  }

  create(shouldRegister?: boolean) {
    return this.factoryInstance.create(this.values, shouldRegister)
  }

  make() {
    return this.factoryInstance.make(this.values)
  }
}

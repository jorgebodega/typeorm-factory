import type { Factory } from '../factory'
import type { Constructable, FactorizedAttrs } from '../types'

export abstract class BaseSubfactory<T> {
  protected factoryInstance: Factory<T>

  constructor(factory: Constructable<Factory<T>>, protected values?: Partial<FactorizedAttrs<T>>) {
    this.factoryInstance = new factory()
  }

  public async createAndFlush(shouldRegister?: boolean) {
    const entity = await this.create(shouldRegister)
    const result = [entity, this.factoryInstance.getCreatedEntities()]
    this.factoryInstance.flushEntities()

    return result
  }

  abstract create(shouldRegister?: boolean): Promise<T> | Promise<T[]>
  abstract make(): Promise<T> | Promise<T[]>
}

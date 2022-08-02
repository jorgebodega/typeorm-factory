import type { DataSource, RemoveOptions, SaveOptions } from 'typeorm'
import { EagerInstanceAttribute, LazyInstanceAttribute } from './instanceAttributes'
import { BaseSubfactory } from './subfactories'
import type { Constructable, FactorizedAttrs } from './types'

export abstract class Factory<T> {
  protected abstract entity: Constructable<T>
  protected abstract dataSource: DataSource
  protected abstract attrs(): FactorizedAttrs<T>

  private createdEntities: T[] = []

  /**
   * Make a new entity without persisting it
   */
  async make(overrideParams: Partial<FactorizedAttrs<T>> = {}): Promise<T> {
    const attrs = { ...this.attrs(), ...overrideParams }

    const entity = await this.makeEntity(attrs, false)
    await this.applyLazyAttributes(entity, attrs, false)

    return entity
  }

  /**
   * Make many new entities without persisting it
   */
  async makeMany(amount: number, overrideParams: Partial<FactorizedAttrs<T>> = {}): Promise<T[]> {
    const list = []
    for (let index = 0; index < amount; index++) {
      list[index] = await this.make(overrideParams)
    }
    return list
  }

  /**
   * Create a new entity and persist it
   */
  async create(overrideParams: Partial<FactorizedAttrs<T>> = {}, saveOptions?: SaveOptions): Promise<T> {
    const attrs = { ...this.attrs(), ...overrideParams }
    const preloadedAttrs = Object.entries(attrs).filter(([, value]) => !(value instanceof LazyInstanceAttribute))

    const entity = await this.makeEntity(Object.fromEntries(preloadedAttrs) as FactorizedAttrs<T>, true)

    const em = this.dataSource.createEntityManager()
    const savedEntity = await em.save<T>(entity, saveOptions)
    this.createdEntities.push(savedEntity)

    await this.applyLazyAttributes(savedEntity, attrs, true)

    return em.save<T>(savedEntity, saveOptions)
  }

  /**
   * Create many new entities and persist them
   */
  async createMany(
    amount: number,
    overrideParams: Partial<FactorizedAttrs<T>> = {},
    saveOptions?: SaveOptions,
  ): Promise<T[]> {
    const list = []
    for (let index = 0; index < amount; index++) {
      list[index] = await this.create(overrideParams, saveOptions)
    }
    return list
  }

  public getCreatedEntities() {
    return this.createdEntities
  }

  /**
   * This method deletes all entities that were created by this factory.
   * The order of deletion is the reverse of the order of creation.
   * @experimental As of version 1.2.0
   */
  public async cleanUp(removeOptions?: RemoveOptions) {
    const entityManager = this.dataSource.createEntityManager()
    for (const entity of this.createdEntities.reverse()) {
      await entityManager.remove(entity, removeOptions)
    }
  }

  public flushEntities() {
    this.createdEntities = []
  }

  private async makeEntity(attrs: FactorizedAttrs<T>, shouldPersist: boolean) {
    const entity = new this.entity()

    await Promise.all(
      Object.entries(attrs)
        .filter(([, value]) => {
          return !(value instanceof EagerInstanceAttribute || value instanceof LazyInstanceAttribute)
        })
        .map(async ([key, value]) => {
          Object.assign(entity, { [key]: await this.resolveValue(value, shouldPersist) })
        }),
    )

    await Promise.all(
      Object.entries(attrs)
        .filter(([, value]) => value instanceof EagerInstanceAttribute)
        .map(async ([key, value]) => {
          if (value instanceof EagerInstanceAttribute) {
            const newAttrib = value.resolve(entity)
            Object.assign(entity, { [key]: await this.resolveValue(newAttrib, shouldPersist) })
          }
        }),
    )

    return entity
  }

  private async applyLazyAttributes(entity: T, attrs: FactorizedAttrs<T>, shouldPersist: boolean) {
    await Promise.all(
      Object.entries(attrs)
        .filter(([, value]) => value instanceof LazyInstanceAttribute)
        .map(async ([key, value]) => {
          if (value instanceof LazyInstanceAttribute) {
            const newAttrib = value.resolve(entity)
            Object.assign(entity, { [key]: await this.resolveValue(newAttrib, shouldPersist) })
          }
        }),
    )
  }

  private async resolveValue(value: unknown, shouldPersist: boolean) {
    if (value instanceof BaseSubfactory) {
      if (!shouldPersist) return value.make()

      const [entity, createdEntities] = await value.createAndFlush()
      this.createdEntities.push(...createdEntities)
      return entity
    } else if (value instanceof Function) {
      return value()
    } else {
      return value
    }
  }
}

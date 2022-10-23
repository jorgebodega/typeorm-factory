import { faker } from '@faker-js/faker'
import { EagerInstanceAttribute, FactorizedAttrs, Factory, LazyInstanceAttribute, SingleSubfactory } from '../../../src'
import { dataSource } from '../dataSource'
import { Pet } from '../entities/Pet.entity'
import { RefugeFactory } from './Refuge.factory'
import { UserFactory } from './User.factory'

export class PetFactory extends Factory<Pet> {
  protected entity = Pet
  protected dataSource = dataSource

  protected attrs(): FactorizedAttrs<Pet> {
    return {
      name: faker.animal.insect(),
      owner: new EagerInstanceAttribute((instance) => new SingleSubfactory(UserFactory, { pet: instance })),
      refuge: new LazyInstanceAttribute((instance) => new SingleSubfactory(RefugeFactory, { pet: instance })),
    }
  }
}

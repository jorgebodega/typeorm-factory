import { faker } from '@faker-js/faker'
import { FactorizedAttrs, Factory, LazyInstanceAttribute, SingleSubfactory } from '../../../src'
import { dataSource } from '../dataSource'
import { User } from '../entities/User.entity'
import { PetFactory } from './Pet.factory'

export class UserFactory extends Factory<User> {
  protected entity = User
  protected dataSource = dataSource

  protected attrs(): FactorizedAttrs<User> {
    return {
      name: faker.person.firstName(),
      lastName: faker.person.lastName(),
      pet: new LazyInstanceAttribute((instance) => new SingleSubfactory(PetFactory, { owner: instance })),
    }
  }
}

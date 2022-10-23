import { faker } from '@faker-js/faker'
import { FactorizedAttrs, Factory } from '../../../src'
import { dataSource } from '../dataSource'
import { User } from '../entities/User.entity'

export class UserFactory extends Factory<User> {
  protected entity = User
  protected dataSource = dataSource

  protected attrs(): FactorizedAttrs<User> {
    return {
      name: faker.name.firstName(),
      lastName: faker.name.lastName(),
      pets: [],
    }
  }
}

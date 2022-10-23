import { faker } from '@faker-js/faker'
import { FactorizedAttrs, Factory } from '../../../src'
import { dataSource } from '../dataSource'
import { Pet } from '../entities/Pet.entity'

export class PetFactory extends Factory<Pet> {
  protected entity = Pet
  protected dataSource = dataSource

  protected attrs(): FactorizedAttrs<Pet> {
    return {
      name: faker.animal.insect(),
      owners: [],
    }
  }
}

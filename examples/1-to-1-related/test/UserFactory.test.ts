import { dataSource } from '../dataSource'
import { Pet } from '../entities/Pet.entity'
import { User } from '../entities/User.entity'
import { UserFactory } from '../factories/User.factory'

describe(UserFactory, () => {
  const factory = new UserFactory()

  describe(UserFactory.prototype.make, () => {
    test('Should make a new entity', async () => {
      const userMaked = await factory.make()

      expect(userMaked).toBeInstanceOf(User)
      expect(userMaked.id).toBeUndefined()
      expect(userMaked.name).toBeDefined()
      expect(userMaked.lastName).toBeDefined()

      expect(userMaked.pet).toBeInstanceOf(Pet)
      expect(userMaked.pet.id).toBeUndefined()
      expect(userMaked.pet.name).toBeDefined()
    })

    test('Should make two entities with different attributes', async () => {
      const userMaked1 = await factory.make()
      const userMaked2 = await factory.make()

      expect(userMaked1).not.toStrictEqual(userMaked2)
    })
  })

  describe(UserFactory.prototype.makeMany, () => {
    test('Should make many new entities', async () => {
      const count = 2
      const entitiesMaked = await factory.makeMany(count)

      expect(entitiesMaked).toHaveLength(count)
      entitiesMaked.forEach((entity) => {
        expect(entity.id).toBeUndefined()
        expect(entity.pet).toBeInstanceOf(Pet)
        expect(entity.pet.id).toBeUndefined()
      })
    })
  })

  describe(UserFactory.prototype.create, () => {
    beforeAll(async () => {
      await dataSource.initialize()
    })

    beforeEach(async () => {
      await dataSource.synchronize(true)
    })

    afterAll(async () => {
      await dataSource.destroy()
    })

    test('Should create a new entity', async () => {
      const userCreated = await factory.create()

      expect(userCreated).toBeInstanceOf(User)
      expect(userCreated.id).toBeDefined()
      expect(userCreated.name).toBeDefined()
      expect(userCreated.lastName).toBeDefined()

      expect(userCreated.pet).toBeInstanceOf(Pet)
      expect(userCreated.pet.id).toBeDefined()
      expect(userCreated.pet.name).toBeDefined()
    })

    test('Should create one entity of each type', async () => {
      await factory.create()

      const [totalUsers, totalPets] = await Promise.all([
        dataSource.createEntityManager().count(User),
        dataSource.createEntityManager().count(Pet),
      ])

      expect(totalUsers).toBe(1)
      expect(totalPets).toBe(1)
    })

    test('Should create two entities with different attributes', async () => {
      const userCreated1 = await factory.create()
      const userCreated2 = await factory.create()

      expect(userCreated1).not.toStrictEqual(userCreated2)
    })
  })

  describe(UserFactory.prototype.createMany, () => {
    beforeAll(async () => {
      await dataSource.initialize()
    })

    beforeEach(async () => {
      await dataSource.synchronize(true)
    })

    afterAll(async () => {
      await dataSource.destroy()
    })

    test('Should create many new entities', async () => {
      const count = 2
      const entitiesCreated = await factory.createMany(count)

      expect(entitiesCreated).toHaveLength(count)
      entitiesCreated.forEach((entity) => {
        expect(entity.id).toBeDefined()
        expect(entity.pet).toBeInstanceOf(Pet)
        expect(entity.pet.id).toBeDefined()
      })
    })

    test('Should create many entities of each type', async () => {
      const count = 2
      await factory.createMany(2)

      const [totalUsers, totalPets] = await Promise.all([
        dataSource.createEntityManager().count(User),
        dataSource.createEntityManager().count(Pet),
      ])

      expect(totalUsers).toBe(count)
      expect(totalPets).toBe(count)
    })
  })
})

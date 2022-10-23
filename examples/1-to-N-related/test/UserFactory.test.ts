import { CollectionSubfactory, LazyInstanceAttribute } from '../../../src'
import { dataSource } from '../dataSource'
import { Pet } from '../entities/Pet.entity'
import { User } from '../entities/User.entity'
import { PetFactory } from '../factories/Pet.factory'
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

      expect(userMaked.pets).toBeInstanceOf(Array)
      expect(userMaked.pets).toHaveLength(0)
    })

    test('Should make a new entity with relation', async () => {
      const userMaked = await factory.make({
        pets: new LazyInstanceAttribute((instance) => new CollectionSubfactory(PetFactory, 1, { owner: instance })),
      })

      expect(userMaked).toBeInstanceOf(User)
      expect(userMaked.id).toBeUndefined()
      expect(userMaked.name).toBeDefined()
      expect(userMaked.lastName).toBeDefined()

      expect(userMaked.pets).toBeInstanceOf(Array)
      expect(userMaked.pets).toHaveLength(1)
      userMaked.pets.forEach((pet) => {
        expect(pet).toBeInstanceOf(Pet)
        expect(pet.id).toBeUndefined()
        expect(pet.owner).toBeDefined()
        expect(pet.owner).toEqual(userMaked)
      })
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
        expect(entity.pets).toBeInstanceOf(Array)
        expect(entity.pets).toHaveLength(0)
      })
    })

    test('Should make many new entities with relations', async () => {
      const count = 2
      const entitiesMaked = await factory.makeMany(count, {
        pets: new LazyInstanceAttribute((instance) => new CollectionSubfactory(PetFactory, 1, { owner: instance })),
      })

      expect(entitiesMaked).toHaveLength(count)
      entitiesMaked.forEach((entity) => {
        expect(entity.id).toBeUndefined()
        expect(entity.pets).toBeInstanceOf(Array)
        expect(entity.pets).toHaveLength(1)
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

      expect(userCreated.pets).toBeInstanceOf(Array)
      expect(userCreated.pets).toHaveLength(0)
    })

    test('Should create a new entity with relation', async () => {
      const userCreated = await factory.create({
        pets: new LazyInstanceAttribute((instance) => new CollectionSubfactory(PetFactory, 1, { owner: instance })),
      })

      expect(userCreated).toBeInstanceOf(User)
      expect(userCreated.id).toBeDefined()
      expect(userCreated.name).toBeDefined()
      expect(userCreated.lastName).toBeDefined()

      expect(userCreated.pets).toBeInstanceOf(Array)
      expect(userCreated.pets).toHaveLength(1)
      userCreated.pets.forEach((pet) => {
        expect(pet).toBeInstanceOf(Pet)
        expect(pet.id).toBeDefined()
        expect(pet.owner).toBeDefined()
        expect(pet.owner).toEqual(userCreated)
      })
    })

    test('Should create one entity of each type', async () => {
      await factory.create()

      const [totalUsers, totalPets] = await Promise.all([
        dataSource.createEntityManager().count(User),
        dataSource.createEntityManager().count(Pet),
      ])

      expect(totalUsers).toBe(1)
      expect(totalPets).toBe(0)
    })

    test('Should create one entity of each type', async () => {
      await factory.create({
        pets: new LazyInstanceAttribute((instance) => new CollectionSubfactory(PetFactory, 1, { owner: instance })),
      })

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
      const entitiesMaked = await factory.createMany(count)

      expect(entitiesMaked).toHaveLength(count)
      entitiesMaked.forEach((entity) => {
        expect(entity.id).toBeDefined()
        expect(entity.pets).toBeInstanceOf(Array)
        expect(entity.pets).toHaveLength(0)
      })
    })

    test('Should create many new entities with relations', async () => {
      const count = 2
      const entitiesMaked = await factory.createMany(count, {
        pets: new LazyInstanceAttribute((instance) => new CollectionSubfactory(PetFactory, 1, { owner: instance })),
      })

      expect(entitiesMaked).toHaveLength(count)
      entitiesMaked.forEach((entity) => {
        expect(entity.id).toBeDefined()
        expect(entity.pets).toBeInstanceOf(Array)
        expect(entity.pets).toHaveLength(1)
      })
    })

    test('Should create many entities without relation', async () => {
      const count = 2
      await factory.createMany(2)

      const [totalUsers, totalPets] = await Promise.all([
        dataSource.createEntityManager().count(User),
        dataSource.createEntityManager().count(Pet),
      ])

      expect(totalUsers).toBe(count)
      expect(totalPets).toBe(0)
    })

    test('Should create many entities of each type with relations', async () => {
      const count = 2
      await factory.createMany(2, {
        pets: new LazyInstanceAttribute((instance) => new CollectionSubfactory(PetFactory, 1, { owner: instance })),
      })

      const [totalUsers, totalPets] = await Promise.all([
        dataSource.createEntityManager().count(User),
        dataSource.createEntityManager().count(Pet),
      ])

      expect(totalUsers).toBe(count)
      expect(totalPets).toBe(count)
    })
  })
})

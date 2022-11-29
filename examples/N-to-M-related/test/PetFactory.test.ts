import { CollectionSubfactory, EagerInstanceAttribute } from '../../../src'
import { dataSource } from '../dataSource'
import { Pet } from '../entities/Pet.entity'
import { User } from '../entities/User.entity'
import { PetFactory } from '../factories/Pet.factory'
import { UserFactory } from '../factories/User.factory'

describe(PetFactory, () => {
  const factory = new PetFactory()

  describe(PetFactory.prototype.make, () => {
    test('Should make a new entity', async () => {
      const petMaked = await factory.make()

      expect(petMaked).toBeInstanceOf(Pet)
      expect(petMaked.id).toBeUndefined()
      expect(petMaked.name).toBeDefined()

      expect(petMaked.owners).toBeInstanceOf(Array)
      expect(petMaked.owners).toHaveLength(0)
    })

    test('Should make a new entity with relation', async () => {
      const petMaked = await factory.make({
        owners: new EagerInstanceAttribute(
          (instance) => new CollectionSubfactory(UserFactory, 1, { pets: [instance] }),
        ),
      })

      expect(petMaked).toBeInstanceOf(Pet)
      expect(petMaked.id).toBeUndefined()
      expect(petMaked.name).toBeDefined()

      expect(petMaked.owners).toBeInstanceOf(Array)
      expect(petMaked.owners).toHaveLength(1)
      petMaked.owners.forEach((owner) => {
        expect(owner).toBeInstanceOf(User)
        expect(owner.id).toBeUndefined()
        expect(owner.pets).toBeInstanceOf(Array)
        expect(owner.pets).toHaveLength(1)
      })
    })

    test('Should make two entities with different attributes', async () => {
      const petMaked1 = await factory.make()
      const petMaked2 = await factory.make()

      expect(petMaked1).not.toStrictEqual(petMaked2)
    })
  })

  describe(PetFactory.prototype.makeMany, () => {
    test('Should make many new entities', async () => {
      const count = 2
      const entitiesMaked = await factory.makeMany(count)

      expect(entitiesMaked).toHaveLength(count)
      entitiesMaked.forEach((entity) => {
        expect(entity.id).toBeUndefined()
        expect(entity.owners).toBeInstanceOf(Array)
        expect(entity.owners).toHaveLength(0)
      })
    })

    test('Should make many new entities with relations', async () => {
      const count = 2
      const entitiesMaked = await factory.makeMany(count, {
        owners: new EagerInstanceAttribute(
          (instance) => new CollectionSubfactory(UserFactory, 1, { pets: [instance] }),
        ),
      })

      expect(entitiesMaked).toHaveLength(count)
      entitiesMaked.forEach((entity) => {
        expect(entity.id).toBeUndefined()
        expect(entity.owners).toBeInstanceOf(Array)
        expect(entity.owners).toHaveLength(1)
      })
    })
  })

  describe(PetFactory.prototype.create, () => {
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
      const petCreated = await factory.create()

      expect(petCreated).toBeInstanceOf(Pet)
      expect(petCreated.id).toBeDefined()
      expect(petCreated.name).toBeDefined()

      expect(petCreated.owners).toBeInstanceOf(Array)
      expect(petCreated.owners).toHaveLength(0)
    })

    test('Should create a new entity with relation', async () => {
      const petCreated = await factory.create({
        owners: new EagerInstanceAttribute(
          (instance) => new CollectionSubfactory(UserFactory, 1, { pets: [instance] }),
        ),
      })

      expect(petCreated).toBeInstanceOf(Pet)
      expect(petCreated.id).toBeDefined()
      expect(petCreated.name).toBeDefined()

      expect(petCreated.owners).toBeInstanceOf(Array)
      expect(petCreated.owners).toHaveLength(1)
      petCreated.owners.forEach((owner) => {
        expect(owner).toBeInstanceOf(User)
        expect(owner.id).toBeDefined()
        expect(owner.pets).toBeInstanceOf(Array)
        expect(owner.pets).toHaveLength(1)
      })
    })

    test('Should create one entity', async () => {
      await factory.create()

      const [totalUsers, totalPets] = await Promise.all([
        dataSource.createEntityManager().count(User),
        dataSource.createEntityManager().count(Pet),
      ])

      expect(totalUsers).toBe(0)
      expect(totalPets).toBe(1)
    })

    test('Should create one entity of each type', async () => {
      await factory.create({
        owners: new EagerInstanceAttribute(
          (instance) => new CollectionSubfactory(UserFactory, 1, { pets: [instance] }),
        ),
      })

      const [totalUsers, totalPets] = await Promise.all([
        dataSource.createEntityManager().count(User),
        dataSource.createEntityManager().count(Pet),
      ])

      expect(totalUsers).toBe(1)
      expect(totalPets).toBe(1)
    })

    test('Should create two entities with different attributes', async () => {
      const petCreated1 = await factory.create()
      const petCreated2 = await factory.create()

      expect(petCreated1).not.toStrictEqual(petCreated2)
    })
  })

  describe(PetFactory.prototype.createMany, () => {
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
        expect(entity.owners).toBeInstanceOf(Array)
        expect(entity.owners).toHaveLength(0)
      })
    })

    test('Should create many new entities with relations', async () => {
      const count = 2
      const entitiesMaked = await factory.createMany(count, {
        owners: new EagerInstanceAttribute(
          (instance) => new CollectionSubfactory(UserFactory, 1, { pets: [instance] }),
        ),
      })

      expect(entitiesMaked).toHaveLength(count)
      entitiesMaked.forEach((entity) => {
        expect(entity.id).toBeDefined()
        expect(entity.owners).toBeInstanceOf(Array)
        expect(entity.owners).toHaveLength(1)
      })
    })

    test('Should create many entities without relation', async () => {
      const count = 2
      await factory.createMany(2)

      const [totalUsers, totalPets] = await Promise.all([
        dataSource.createEntityManager().count(User),
        dataSource.createEntityManager().count(Pet),
      ])

      expect(totalUsers).toBe(0)
      expect(totalPets).toBe(count)
    })

    test('Should create many entities of each type with relations', async () => {
      const count = 2
      await factory.createMany(2, {
        owners: new EagerInstanceAttribute(
          (instance) => new CollectionSubfactory(UserFactory, 1, { pets: [instance] }),
        ),
      })

      const [totalUsers, totalPets] = await Promise.all([
        dataSource.createEntityManager().count(User),
        dataSource.createEntityManager().count(Pet),
      ])

      expect(totalUsers).toBe(count)
      expect(totalPets).toBe(count)
    })

    test('Should create many entities related with many other entities', async () => {
      const count = 2
      const petsCreated = await factory.createMany(2)
      await new UserFactory().createMany(2, {
        pets: petsCreated,
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

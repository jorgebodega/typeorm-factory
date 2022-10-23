import { dataSource } from '../dataSource'
import { Pet } from '../entities/Pet.entity'
import { Refuge } from '../entities/Refuge.entity'
import { User } from '../entities/User.entity'
import { PetFactory } from '../factories/Pet.factory'

describe(PetFactory, () => {
  const factory = new PetFactory()

  describe(PetFactory.prototype.make, () => {
    test('Should make a new entity', async () => {
      const petMaked = await factory.make()

      expect(petMaked).toBeInstanceOf(Pet)
      expect(petMaked.id).toBeUndefined()
      expect(petMaked.name).toBeDefined()

      expect(petMaked.refuge).toBeInstanceOf(Refuge)
      expect(petMaked.refuge.id).toBeUndefined()
      expect(petMaked.refuge.name).toBeDefined()

      expect(petMaked.owner).toBeInstanceOf(User)
      expect(petMaked.owner.id).toBeUndefined()
      expect(petMaked.owner.name).toBeDefined()
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

        expect(entity.refuge).toBeInstanceOf(Refuge)
        expect(entity.refuge.id).toBeUndefined()

        expect(entity.owner).toBeInstanceOf(User)
        expect(entity.owner.id).toBeUndefined()
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

      expect(petCreated.refuge).toBeInstanceOf(Refuge)
      expect(petCreated.refuge.id).toBeDefined()
      expect(petCreated.refuge.name).toBeDefined()
      expect(petCreated.refuge.pet).toEqual(petCreated)

      expect(petCreated.owner).toBeInstanceOf(User)
      expect(petCreated.owner.id).toBeDefined()
      expect(petCreated.owner.name).toBeDefined()
    })

    test('Should create one entity of each type', async () => {
      await factory.create()

      const [totalUsers, totalPets, totalRefuges] = await Promise.all([
        dataSource.createEntityManager().count(User),
        dataSource.createEntityManager().count(Pet),
        dataSource.createEntityManager().count(Refuge),
      ])

      expect(totalUsers).toBe(1)
      expect(totalPets).toBe(1)
      expect(totalRefuges).toBe(1)
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
      const entitiesCreated = await factory.createMany(count)

      expect(entitiesCreated).toHaveLength(count)
      entitiesCreated.forEach((entity) => {
        expect(entity.id).toBeDefined()

        expect(entity.refuge).toBeInstanceOf(Refuge)
        expect(entity.refuge.id).toBeDefined()
        expect(entity.refuge.pet).toEqual(entity)

        expect(entity.owner).toBeInstanceOf(User)
        expect(entity.owner.id).toBeDefined()
      })
    })

    test('Should create many entities of each type', async () => {
      const count = 2
      await factory.createMany(2)

      const [totalUsers, totalPets, totalRefuges] = await Promise.all([
        dataSource.createEntityManager().count(User),
        dataSource.createEntityManager().count(Pet),
        dataSource.createEntityManager().count(Refuge),
      ])

      expect(totalUsers).toBe(count)
      expect(totalPets).toBe(count)
      expect(totalRefuges).toBe(count)
    })
  })
})

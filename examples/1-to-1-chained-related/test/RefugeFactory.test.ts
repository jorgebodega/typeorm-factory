import { dataSource } from "../dataSource";
import { Pet } from "../entities/Pet.entity";
import { Refuge } from "../entities/Refuge.entity";
import { User } from "../entities/User.entity";
import { RefugeFactory } from "../factories/Refuge.factory";

describe(RefugeFactory, () => {
	const factory = new RefugeFactory();

	describe(RefugeFactory.prototype.make, () => {
		test("Should make a new entity", async () => {
			const refugeMaked = await factory.make();

			expect(refugeMaked).toBeInstanceOf(Refuge);
			expect(refugeMaked.id).toBeUndefined();
			expect(refugeMaked.name).toBeDefined();

			expect(refugeMaked.pet).toBeInstanceOf(Pet);
			expect(refugeMaked.pet.id).toBeUndefined();
			expect(refugeMaked.pet.name).toBeDefined();

			expect(refugeMaked.pet.owner).toBeInstanceOf(User);
			expect(refugeMaked.pet.owner.id).toBeUndefined();
			expect(refugeMaked.pet.owner.name).toBeDefined();
		});

		test("Should make two entities with different attributes", async () => {
			const refugeMaked1 = await factory.make();
			const refugeMaked2 = await factory.make();

			expect(refugeMaked1).not.toStrictEqual(refugeMaked2);
		});
	});

	describe(RefugeFactory.prototype.makeMany, () => {
		test("Should make many new entities", async () => {
			const count = 2;
			const entitiesMaked = await factory.makeMany(count);

			expect(entitiesMaked).toHaveLength(count);
			entitiesMaked.forEach((entity) => {
				expect(entity.id).toBeUndefined();

				expect(entity.pet).toBeInstanceOf(Pet);
				expect(entity.pet.id).toBeUndefined();

				expect(entity.pet.owner).toBeInstanceOf(User);
				expect(entity.pet.owner.id).toBeUndefined();
			});
		});
	});

	describe(RefugeFactory.prototype.create, () => {
		beforeAll(async () => {
			await dataSource.initialize();
		});

		beforeEach(async () => {
			await dataSource.synchronize(true);
		});

		afterAll(async () => {
			await dataSource.destroy();
		});

		test("Should create a new entity", async () => {
			const refugeCreated = await factory.create();

			expect(refugeCreated).toBeInstanceOf(Refuge);
			expect(refugeCreated.id).toBeDefined();
			expect(refugeCreated.name).toBeDefined();

			expect(refugeCreated.pet).toBeInstanceOf(Pet);
			expect(refugeCreated.pet.id).toBeDefined();
			expect(refugeCreated.pet.name).toBeDefined();

			expect(refugeCreated.pet.owner).toBeInstanceOf(User);
			expect(refugeCreated.pet.owner.id).toBeDefined();
			expect(refugeCreated.pet.owner.name).toBeDefined();
		});

		test("Should create one entity of each type", async () => {
			await factory.create();

			const [totalUsers, totalPets, totalRefuges] = await Promise.all([
				dataSource.createEntityManager().count(User),
				dataSource.createEntityManager().count(Pet),
				dataSource.createEntityManager().count(Refuge),
			]);

			expect(totalUsers).toBe(1);
			expect(totalPets).toBe(1);
			expect(totalRefuges).toBe(1);
		});

		test("Should create two entities with different attributes", async () => {
			const petCreated1 = await factory.create();
			const petCreated2 = await factory.create();

			expect(petCreated1).not.toStrictEqual(petCreated2);
		});
	});

	describe(RefugeFactory.prototype.createMany, () => {
		beforeAll(async () => {
			await dataSource.initialize();
		});

		beforeEach(async () => {
			await dataSource.synchronize(true);
		});

		afterAll(async () => {
			await dataSource.destroy();
		});

		test("Should create many new entities", async () => {
			const count = 2;
			const entitiesCreated = await factory.createMany(count);

			expect(entitiesCreated).toHaveLength(count);
			entitiesCreated.forEach((entity) => {
				expect(entity.id).toBeDefined();

				expect(entity.pet).toBeInstanceOf(Pet);
				expect(entity.pet.id).toBeDefined();

				expect(entity.pet.owner).toBeInstanceOf(User);
				expect(entity.pet.owner.id).toBeDefined();
			});
		});
	});
});

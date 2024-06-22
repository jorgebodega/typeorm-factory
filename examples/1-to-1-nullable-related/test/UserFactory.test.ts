import { LazyInstanceAttribute, SingleSubfactory } from "../../../src";
import { dataSource } from "../dataSource";
import { Pet } from "../entities/Pet.entity";
import { User } from "../entities/User.entity";
import { PetFactory } from "../factories/Pet.factory";
import { UserFactory } from "../factories/User.factory";

describe(UserFactory, () => {
	const factory = new UserFactory();

	describe(UserFactory.prototype.make, () => {
		test("Should make a new entity without relation", async () => {
			const userMaked = await factory.make();

			expect(userMaked).toBeInstanceOf(User);
			expect(userMaked.id).toBeUndefined();
			expect(userMaked.name).toBeDefined();
			expect(userMaked.lastName).toBeDefined();

			expect(userMaked.pet).toBeUndefined();
		});

		test("Should make a new entity with relation", async () => {
			const userMaked = await factory.make({
				pet: new LazyInstanceAttribute((instance) => new SingleSubfactory(PetFactory, { owner: instance })),
			});

			expect(userMaked).toBeInstanceOf(User);
			expect(userMaked.id).toBeUndefined();
			expect(userMaked.name).toBeDefined();
			expect(userMaked.lastName).toBeDefined();

			expect(userMaked.pet).toBeDefined();
			expect(userMaked.pet).toBeInstanceOf(Pet);
			expect(userMaked.pet?.id).toBeUndefined();
			expect(userMaked.pet?.name).toBeDefined();
			expect(userMaked.pet?.owner).toEqual(userMaked);
		});

		test("Should make two entities with different attributes", async () => {
			const userMaked1 = await factory.make();
			const userMaked2 = await factory.make();

			expect(userMaked1).not.toStrictEqual(userMaked2);
		});
	});

	describe(UserFactory.prototype.makeMany, () => {
		test("Should make many new entities without relation", async () => {
			const count = 2;
			const entitiesMaked = await factory.makeMany(count);

			expect(entitiesMaked).toHaveLength(count);

			for (const entity of entitiesMaked) {
				expect(entity.id).toBeUndefined();
				expect(entity.pet).toBeUndefined();
			}
		});

		test("Should make many new entities with relation", async () => {
			const count = 2;
			const entitiesMaked = await factory.makeMany(count, {
				pet: new LazyInstanceAttribute((instance) => new SingleSubfactory(PetFactory, { owner: instance })),
			});

			expect(entitiesMaked).toHaveLength(count);

			for (const entity of entitiesMaked) {
				expect(entity.id).toBeUndefined();
				expect(entity.pet).toBeInstanceOf(Pet);
				expect(entity.pet?.id).toBeUndefined();
			}
		});
	});

	describe(UserFactory.prototype.create, () => {
		beforeAll(async () => {
			await dataSource.initialize();
		});

		beforeEach(async () => {
			await dataSource.synchronize(true);
		});

		afterAll(async () => {
			await dataSource.destroy();
		});

		test("Should create a new entity without relation", async () => {
			const userCreated = await factory.create();

			expect(userCreated).toBeInstanceOf(User);
			expect(userCreated.id).toBeDefined();
			expect(userCreated.name).toBeDefined();
			expect(userCreated.lastName).toBeDefined();

			expect(userCreated.pet).toBeUndefined();
		});

		test("Should create a new entity with relation", async () => {
			const userCreated = await factory.create({
				pet: new LazyInstanceAttribute((instance) => new SingleSubfactory(PetFactory, { owner: instance })),
			});

			expect(userCreated).toBeInstanceOf(User);
			expect(userCreated.id).toBeDefined();
			expect(userCreated.name).toBeDefined();
			expect(userCreated.lastName).toBeDefined();

			expect(userCreated.pet).toBeDefined();
			expect(userCreated.pet).toBeInstanceOf(Pet);
			expect(userCreated.pet?.id).toBeDefined();
			expect(userCreated.pet?.owner).toEqual(userCreated);
		});

		test("Should create one entity without relation", async () => {
			await factory.create();

			const [totalUsers, totalPets] = await Promise.all([
				dataSource.createEntityManager().count(User),
				dataSource.createEntityManager().count(Pet),
			]);

			expect(totalUsers).toBe(1);
			expect(totalPets).toBe(0);
		});

		test("Should create one entity of each type with relation", async () => {
			await factory.create({
				pet: new LazyInstanceAttribute((instance) => new SingleSubfactory(PetFactory, { owner: instance })),
			});

			const [totalUsers, totalPets] = await Promise.all([
				dataSource.createEntityManager().count(User),
				dataSource.createEntityManager().count(Pet),
			]);

			expect(totalUsers).toBe(1);
			expect(totalPets).toBe(1);
		});

		test("Should create two entities with different attributes", async () => {
			const userCreated1 = await factory.create();
			const userCreated2 = await factory.create();

			expect(userCreated1).not.toStrictEqual(userCreated2);
		});
	});

	describe(UserFactory.prototype.createMany, () => {
		beforeAll(async () => {
			await dataSource.initialize();
		});

		beforeEach(async () => {
			await dataSource.synchronize(true);
		});

		afterAll(async () => {
			await dataSource.destroy();
		});

		test("Should create many new entities without relation", async () => {
			const count = 2;
			const entitiesCreated = await factory.createMany(count);

			expect(entitiesCreated).toHaveLength(count);

			for (const entity of entitiesCreated) {
				expect(entity.id).toBeDefined();
				expect(entity.pet).toBeUndefined();
			}
		});

		test("Should create many new entities with relation", async () => {
			const count = 2;
			const entitiesCreated = await factory.createMany(count, {
				pet: new LazyInstanceAttribute((instance) => new SingleSubfactory(PetFactory, { owner: instance })),
			});

			expect(entitiesCreated).toHaveLength(count);

			for (const entity of entitiesCreated) {
				expect(entity.id).toBeDefined();
				expect(entity.pet).toBeInstanceOf(Pet);
				expect(entity.pet?.id).toBeDefined();
			}
		});

		test("Should create many entities without relation", async () => {
			const count = 2;
			await factory.createMany(2);

			const [totalUsers, totalPets] = await Promise.all([
				dataSource.createEntityManager().count(User),
				dataSource.createEntityManager().count(Pet),
			]);

			expect(totalUsers).toBe(count);
			expect(totalPets).toBe(0);
		});

		test("Should create many entities of each type with relations", async () => {
			const count = 2;
			await factory.createMany(2, {
				pet: new LazyInstanceAttribute((instance) => new SingleSubfactory(PetFactory, { owner: instance })),
			});

			const [totalUsers, totalPets] = await Promise.all([
				dataSource.createEntityManager().count(User),
				dataSource.createEntityManager().count(Pet),
			]);

			expect(totalUsers).toBe(count);
			expect(totalPets).toBe(count);
		});
	});
});

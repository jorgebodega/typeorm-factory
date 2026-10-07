import { dataSource } from "../dataSource";
import { Pet } from "../entities/Pet.entity";
import { Refuge } from "../entities/Refuge.entity";
import { User } from "../entities/User.entity";
import { PetFactory } from "../factories/Pet.factory";

describe(PetFactory, () => {
	const factory = new PetFactory();

	describe(PetFactory.prototype.make, () => {
		test("Should make a new entity", async () => {
			const petMaked = await factory.make();

			expect(petMaked).toBeInstanceOf(Pet);
			expect(petMaked.id).toBeUndefined();
			expect(petMaked.name).toBeDefined();

			expect(petMaked.refuge).toBeInstanceOf(Refuge);
			expect(petMaked.refuge.id).toBeUndefined();
			expect(petMaked.refuge.name).toBeDefined();

			expect(petMaked.owner).toBeInstanceOf(User);
			expect(petMaked.owner.id).toBeUndefined();
			expect(petMaked.owner.name).toBeDefined();
		});
	});

	describe(PetFactory.prototype.create, () => {
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
			const petCreated = await factory.create();

			expect(petCreated).toBeInstanceOf(Pet);
			expect(petCreated.id).toBeDefined();
			expect(petCreated.name).toBeDefined();

			expect(petCreated.refuge).toBeInstanceOf(Refuge);
			expect(petCreated.refuge.id).toBeDefined();
			expect(petCreated.refuge.name).toBeDefined();
			expect(petCreated.refuge.pet).toEqual(petCreated);

			expect(petCreated.owner).toBeInstanceOf(User);
			expect(petCreated.owner.id).toBeDefined();
			expect(petCreated.owner.name).toBeDefined();
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
	});

	describe(PetFactory.prototype.createMany, () => {
		beforeAll(async () => {
			await dataSource.initialize();
		});

		beforeEach(async () => {
			await dataSource.synchronize(true);
		});

		afterAll(async () => {
			await dataSource.destroy();
		});

		test("Should create many entities of each type", async () => {
			const count = 2;
			await factory.createMany(2);

			const [totalUsers, totalPets, totalRefuges] = await Promise.all([
				dataSource.createEntityManager().count(User),
				dataSource.createEntityManager().count(Pet),
				dataSource.createEntityManager().count(Refuge),
			]);

			expect(totalUsers).toBe(count);
			expect(totalPets).toBe(count);
			expect(totalRefuges).toBe(count);
		});
	});
});

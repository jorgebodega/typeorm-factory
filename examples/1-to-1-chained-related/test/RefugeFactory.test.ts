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
	});
});

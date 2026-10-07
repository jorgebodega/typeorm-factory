import { dataSource } from "../dataSource";
import { Pet } from "../entities/Pet.entity";
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

			expect(petCreated.owner).toBeInstanceOf(User);
			expect(petCreated.owner.id).toBeDefined();
			expect(petCreated.owner.name).toBeDefined();
		});
	});
});

import { dataSource } from "../dataSource";
import { User } from "../entities/User.entity";
import { UserFactory } from "../factories/User.factory";

describe(UserFactory, () => {
	const factory = new UserFactory();

	describe(UserFactory.prototype.make, () => {
		test("Should make a new entity", async () => {
			const userMaked = await factory.make();

			expect(userMaked).toBeInstanceOf(User);
			expect(userMaked.id).toBeUndefined();
			expect(userMaked.name).toBeDefined();
			expect(userMaked.lastName).toBeDefined();
		});

		test("Should make two entities with different attributes", async () => {
			const userMaked1 = await factory.make();
			const userMaked2 = await factory.make();

			expect(userMaked1).not.toStrictEqual(userMaked2);
		});
	});

	describe(UserFactory.prototype.makeMany, () => {
		test("Should make many new entities", async () => {
			const count = 2;
			const entitiesMaked = await factory.makeMany(count);

			expect(entitiesMaked).toHaveLength(count);
			entitiesMaked.forEach((entity) => {
				expect(entity.id).toBeUndefined();
			});
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

		test("Should create a new entity", async () => {
			const userCreated = await factory.create();

			expect(userCreated).toBeInstanceOf(User);
			expect(userCreated.id).toBeDefined();
			expect(userCreated.name).toBeDefined();
			expect(userCreated.lastName).toBeDefined();
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

		test("Should create many new entities", async () => {
			const count = 2;
			const entitiesCreated = await factory.createMany(count);

			expect(entitiesCreated).toHaveLength(count);
			entitiesCreated.forEach((entity) => {
				expect(entity.id).toBeDefined();
			});
		});
	});
});

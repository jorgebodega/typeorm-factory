import { faker } from "@faker-js/faker";
import { type FactorizedAttrs, Factory } from "../../../src";
import { dataSource } from "../dataSource";
import { User } from "../entities/User.entity";

export class UserFactory extends Factory<User> {
	protected entity = User;
	protected dataSource = dataSource;

	protected attrs(): FactorizedAttrs<User> {
		return {
			name: faker.person.firstName(),
			lastName: faker.person.lastName(),
			pets: [],
		};
	}
}

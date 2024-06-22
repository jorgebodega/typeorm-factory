import { faker } from "@faker-js/faker";
import { EagerInstanceAttribute, FactorizedAttrs, Factory, SingleSubfactory } from "../../../src";
import { dataSource } from "../dataSource";
import { Pet } from "../entities/Pet.entity";
import { UserFactory } from "./User.factory";

export class PetFactory extends Factory<Pet> {
	protected entity = Pet;
	protected dataSource = dataSource;

	protected attrs(): FactorizedAttrs<Pet> {
		return {
			name: faker.animal.insect(),
			owner: new EagerInstanceAttribute((instance) => new SingleSubfactory(UserFactory, { pet: instance })),
		};
	}
}
